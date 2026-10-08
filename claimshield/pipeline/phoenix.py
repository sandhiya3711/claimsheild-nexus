"""
ClaimShield Nexus: Phoenix Entity Resolution.
Detects reincarnated clinics where a previously shuttered entity (e.g., P090) re-emerges
as a newly enrolled provider (e.g., P101) under shared ownership, patient overlap,
and matching billing-code fingerprints.
"""

from datetime import datetime
import numpy as np
import pandas as pd


def compute_code_distribution(claims, pid):
    p_claims = claims[claims["provider_id"] == pid]
    if p_claims.empty:
        return {}
    counts = p_claims["cpt_code"].value_counts(normalize=True).to_dict()
    return counts


def cosine_similarity_dicts(d1, d2):
    all_keys = set(d1.keys()).union(set(d2.keys()))
    if not all_keys:
        return 0.0
    v1 = np.array([d1.get(k, 0.0) for k in all_keys])
    v2 = np.array([d2.get(k, 0.0) for k in all_keys])
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(v1, v2) / (norm1 * norm2))


def run_phoenix_resolution(dataset):
    providers = dataset["providers"]
    claims = dataset["claims"]

    closed_providers = providers[providers["closure_date"].notna()]
    active_providers = providers[providers["closure_date"].isna()]

    phoenix_links = []

    for _, closed in closed_providers.iterrows():
        c_pid = closed["provider_id"]
        c_owner = closed["owner_id"]
        c_closed_dt = datetime.strptime(closed["closure_date"], "%Y-%m-%d")
        c_claims = claims[claims["provider_id"] == c_pid]
        c_mems = set(c_claims["member_id"].unique())
        c_code_dist = compute_code_distribution(claims, c_pid)

        for _, act in active_providers.iterrows():
            a_pid = act["provider_id"]
            a_owner = act["owner_id"]
            a_enr_dt_str = act["enrollment_date"]
            if not a_enr_dt_str:
                continue
            a_enr_dt = datetime.strptime(a_enr_dt_str, "%Y-%m-%d")

            # Check if enrolled after or near closure (within 180 days)
            days_gap = (a_enr_dt - c_closed_dt).days
            if -30 <= days_gap <= 180:
                # 1. Owner Match (0.35 weight)
                owner_match = 1.0 if (c_owner and a_owner and c_owner == a_owner) else 0.0

                # 2. Code cosine similarity (0.25 weight)
                a_code_dist = compute_code_distribution(claims, a_pid)
                code_sim = cosine_similarity_dicts(c_code_dist, a_code_dist)

                # 3. Member overlap (0.25 weight)
                a_claims = claims[claims["provider_id"] == a_pid]
                a_mems = set(a_claims["member_id"].unique())
                union_mems = c_mems.union(a_mems)
                overlap_ratio = len(c_mems.intersection(a_mems)) / max(len(c_mems), 1) if union_mems else 0.0

                # 4. Gap score (0.15 weight)
                gap_score = max(0.0, 1.0 - (abs(days_gap) / 180.0))

                # Weighted Composite Score
                total_score = (
                    0.35 * owner_match +
                    0.25 * code_sim +
                    0.25 * min(1.0, overlap_ratio * 1.4) +
                    0.15 * gap_score
                )

                if total_score >= 0.70:
                    phoenix_links.append({
                        "closed_provider_id": c_pid,
                        "closed_provider_name": closed["name"],
                        "closed_date": closed["closure_date"],
                        "reopened_provider_id": a_pid,
                        "reopened_provider_name": act["name"],
                        "reopened_enrollment_date": act["enrollment_date"],
                        "days_between_closure_and_reopen": days_gap,
                        "phoenix_match_score": round(float(total_score), 3),
                        "component_scores": {
                            "owner_match_score": round(float(owner_match), 2),
                            "shared_owner_id": c_owner if owner_match else None,
                            "billing_code_similarity": round(float(code_sim), 3),
                            "patient_overlap_ratio": round(float(overlap_ratio), 3),
                            "overlapping_patients_count": len(c_mems.intersection(a_mems)),
                            "timing_proximity_score": round(float(gap_score), 2)
                        },
                        "verdict": "HIGH_CONFIDENCE_PHOENIX_REINCARNATION" if total_score >= 0.85 else "PROBABLE_SUCCESSOR"
                    })

    return phoenix_links


if __name__ == "__main__":
    from claimshield.pipeline.features import load_dataset
    ds = load_dataset()
    links = run_phoenix_resolution(ds)
    print(f"[*] Detected {len(links)} Phoenix Entity Reincarnations:")
    for l in links:
        print(f"    - {l['closed_provider_id']} -> {l['reopened_provider_id']} (Score: {l['phoenix_match_score']}) | Overlap: {l['component_scores']['overlapping_patients_count']} patients")
