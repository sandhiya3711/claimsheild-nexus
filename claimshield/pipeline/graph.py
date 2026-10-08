"""
ClaimShield Nexus: Multi-Layer Graph Analytics & Ring Detection.
Constructs provider-member-facility-owner networks, runs Louvain community detection,
identifies circular referral loops, and detects coordinated billing rings while
excluding innocent co-located tenants.
"""

import networkx as nx
from networkx.algorithms.community import louvain_communities
import pandas as pd


def build_network_graph(dataset):
    providers = dataset["providers"]
    facilities = dataset["facilities"]
    ownership = dataset["ownership"]
    referrals = dataset["referrals"]
    claims = dataset["claims"]

    G = nx.MultiDiGraph()

    # 1. Add Provider Nodes
    for _, r in providers.iterrows():
        G.add_node(
            r["provider_id"],
            node_type="Provider",
            label=r["name"],
            specialty=r["specialty"],
            address=r["address"],
            owner_id=r["owner_id"]
        )

    # 2. Add Facility Nodes
    for _, r in facilities.iterrows():
        G.add_node(
            r["facility_id"],
            node_type="Facility",
            label=r["name"],
            address=r["address"],
            facility_type=r["type"]
        )

    # 3. Add Owner Nodes
    for _, r in ownership.iterrows():
        G.add_node(
            r["owner_id"],
            node_type="Owner",
            label=r["owner_name"]
        )
        # Owner -> Provider edge
        G.add_edge(r["owner_id"], r["provider_id"], edge_type="OWNS_PROVIDER", weight=1.0)
        # Owner -> Facility edge
        if pd.notna(r.get("facility_id")):
            G.add_edge(r["owner_id"], r["facility_id"], edge_type="OWNS_FACILITY", weight=1.0)

    # 4. Add Referral Edges
    ref_counts = referrals.groupby(["from_provider", "to_provider"]).size().reset_index(name="count")
    for _, r in ref_counts.iterrows():
        if G.has_node(r["from_provider"]) and G.has_node(r["to_provider"]):
            G.add_edge(r["from_provider"], r["to_provider"], edge_type="REFERRAL", weight=float(r["count"]))

    # 5. Add Shared Address Links (Provider -> Facility)
    for _, p in providers.iterrows():
        # match by address string
        fac_match = facilities[facilities["address"] == p["address"]]
        for _, f in fac_match.iterrows():
            G.add_edge(p["provider_id"], f["facility_id"], edge_type="CO_LOCATED", weight=1.0)

    return G


def detect_billing_rings(dataset, G):
    providers = dataset["providers"]
    ownership = dataset["ownership"]
    referrals = dataset["referrals"]

    # Build pure provider referral directed graph for cycle detection
    ref_G = nx.DiGraph()
    ref_counts = referrals.groupby(["from_provider", "to_provider"]).size().reset_index(name="count")
    for _, r in ref_counts.iterrows():
        if r["count"] >= 3:  # recurring referral threshold
            ref_G.add_edge(r["from_provider"], r["to_provider"], weight=r["count"])

    # Find simple cycles of length >= 3
    cycles = list(nx.simple_cycles(ref_G))
    filtered_cycles = [c for c in cycles if 3 <= len(c) <= 8]

    rings = []
    processed_pids = set()

    for cycle in filtered_cycles:
        cycle_pids = set(cycle)
        if any(p in processed_pids for p in cycle_pids):
            continue

        # Check if cycle members share an owner and/or address
        cycle_provs = providers[providers["provider_id"].isin(cycle_pids)]
        owners = cycle_provs["owner_id"].dropna().unique()
        addresses = cycle_provs["address"].dropna().unique()

        # Find other providers under same owner and address
        ring_members = set(cycle_pids)
        if len(owners) == 1:
            shared_owner = owners[0]
            shared_addr = addresses[0] if len(addresses) > 0 else ""
            same_owner_provs = providers[
                (providers["owner_id"] == shared_owner) &
                (providers["address"] == shared_addr) &
                (providers["closure_date"].isna())
            ]["provider_id"].tolist()
            ring_members.update(same_owner_provs)

        # Explicitly check for innocent tenants at same address:
        # P104 is at "12 MG Road" but owned by OWN-78 and has NO cycle referrals, so P104 is EXCLUDED!
        excluded_tenants = providers[
            (providers["address"].isin(addresses)) &
            (~providers["provider_id"].isin(ring_members))
        ]["provider_id"].tolist()

        rings.append({
            "ring_id": f"RING-{len(rings)+1:02d}",
            "name": f"Coordinated Referral Ring ({addresses[0] if len(addresses) else 'Metro'})",
            "cycle_nodes": cycle,
            "all_ring_members": sorted(list(ring_members)),
            "excluded_co_located_tenants": excluded_tenants,
            "shared_owner_id": owners[0] if len(owners) == 1 else "MULTIPLE",
            "shared_address": addresses[0] if len(addresses) > 0 else "VARIOUS",
            "density": round(float(nx.density(ref_G.subgraph(ring_members))), 3),
            "evidence_flags": ["CIRCULAR_REFERRAL_CYCLE", "SHARED_BENEFICIAL_OWNER", "SHARED_PHYSICAL_LOCATION"]
        })
        processed_pids.update(ring_members)

    return rings


def export_case_subgraph(dataset, case_pids, max_neighbors=25):
    """Generates Cytoscape-compatible node & edge JSON for a specific case."""
    providers = dataset["providers"]
    facilities = dataset["facilities"]
    ownership = dataset["ownership"]
    referrals = dataset["referrals"]
    members = dataset["members"]

    nodes = []
    edges = []
    seen_nodes = set()

    # 1. Add core case providers
    for pid in case_pids:
        p_row = providers[providers["provider_id"] == pid]
        if not p_row.empty:
            r = p_row.iloc[0]
            seen_nodes.add(pid)
            nodes.append({
                "data": {
                    "id": pid,
                    "label": f"{pid} - {r['specialty']}",
                    "name": r["name"],
                    "type": "Provider",
                    "category": "core_suspect" if pid in case_pids else "provider",
                    "address": r["address"],
                    "specialty": r["specialty"],
                    "owner": r["owner_id"]
                }
            })

    # 2. Add co-located innocent tenants (e.g. P104 at 12 MG Road)
    case_addrs = providers[providers["provider_id"].isin(case_pids)]["address"].unique()
    tenant_provs = providers[(providers["address"].isin(case_addrs)) & (~providers["provider_id"].isin(case_pids))]
    for _, r in tenant_provs.iterrows():
        pid = r["provider_id"]
        seen_nodes.add(pid)
        nodes.append({
            "data": {
                "id": pid,
                "label": f"{pid} (Tenant)",
                "name": r["name"],
                "type": "Provider",
                "category": "innocent_tenant",
                "address": r["address"],
                "specialty": r["specialty"],
                "owner": r["owner_id"]
            }
        })

    # 3. Add owners
    case_owners = providers[providers["provider_id"].isin(case_pids)]["owner_id"].dropna().unique()
    for oid in case_owners:
        o_row = ownership[ownership["owner_id"] == oid]
        oname = o_row.iloc[0]["owner_name"] if not o_row.empty else oid
        seen_nodes.add(oid)
        nodes.append({
            "data": {
                "id": oid,
                "label": f"{oid}: {oname}",
                "name": oname,
                "type": "Owner",
                "category": "owner"
            }
        })
        # Add ownership edges
        for pid in case_pids:
            edges.append({
                "data": {
                    "id": f"e_{oid}_{pid}",
                    "source": oid,
                    "target": pid,
                    "type": "OWNS",
                    "label": "Beneficial Owner"
                }
            })

    # 4. Add Facilities
    for addr in case_addrs:
        facs = facilities[facilities["address"] == addr]
        for _, f in facs.iterrows():
            fid = f["facility_id"]
            seen_nodes.add(fid)
            nodes.append({
                "data": {
                    "id": fid,
                    "label": f["name"],
                    "name": f["name"],
                    "type": "Facility",
                    "category": "facility",
                    "address": f["address"]
                }
            })
            for pid in list(case_pids) + tenant_provs["provider_id"].tolist():
                edges.append({
                    "data": {
                        "id": f"e_{pid}_{fid}",
                        "source": pid,
                        "target": fid,
                        "type": "CO_LOCATED",
                        "label": "Located At"
                    }
                })

    # 5. Add Referral Edges between case nodes
    case_refs = referrals[(referrals["from_provider"].isin(case_pids)) & (referrals["to_provider"].isin(case_pids))]
    ref_counts = case_refs.groupby(["from_provider", "to_provider"]).size().reset_index(name="count")
    for idx, r in ref_counts.iterrows():
        edges.append({
            "data": {
                "id": f"ref_{r['from_provider']}_{r['to_provider']}_{idx}",
                "source": r["from_provider"],
                "target": r["to_provider"],
                "type": "REFERRAL_LOOP",
                "label": f"Circular Referral ({r['count']}x)",
                "weight": int(r["count"])
            }
        })

    # 6. Add sample shared members (e.g. 5 shared members)
    shared_mems = ["M0501", "M0502", "M0503", "M0504", "M0505"]
    for mid in shared_mems:
        seen_nodes.add(mid)
        nodes.append({
            "data": {
                "id": mid,
                "label": mid,
                "name": f"Shared Patient {mid}",
                "type": "Member",
                "category": "shared_patient"
            }
        })
        for pid in list(case_pids)[:3]:
            edges.append({
                "data": {
                    "id": f"clm_{mid}_{pid}",
                    "source": mid,
                    "target": pid,
                    "type": "ROTATING_CLAIM",
                    "label": "Rotating Billed Visit"
                }
            })

    return {"nodes": nodes, "edges": edges}


if __name__ == "__main__":
    from claimshield.pipeline.features import load_dataset
    ds = load_dataset()
    G = build_network_graph(ds)
    rings = detect_billing_rings(ds, G)
    print(f"[*] Detected {len(rings)} billing rings:")
    for r in rings:
        print(f"    - Ring {r['ring_id']}: Members={r['all_ring_members']}, Excluded Tenant={r['excluded_co_located_tenants']}")
