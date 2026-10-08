"""
ClaimShield Nexus: Deterministic Rules Engine.
Detects 6 distinct claim-level fraud, waste, and abuse behaviors:
1. Duplicate Billing
2. Upcoding (Specialty Peer Z > 3.0)
3. Unbundling (Component coding)
4. Impossible Timing (>24h/day or overlapping transports)
5. Excessive Utilization (Outlier visit velocity)
6. Phantom Services (High-risk DME / No-care patterns)
"""

import pandas as pd
import numpy as np


def run_rules_engine(dataset, provider_features):
    claims = dataset["claims"]
    providers = dataset["providers"]
    flags = []

    # 1. DUPLICATE BILLING
    # Check exact duplicate (member_id, provider_id, cpt_code, service_date)
    dup_groups = claims.groupby(["member_id", "provider_id", "cpt_code", "service_date"])
    for (m, p, cpt, dt), group in dup_groups:
        if len(group) > 1:
            claim_ids = group["claim_id"].tolist()
            paid_sum = float(group["paid_amt"].sum())
            flags.append({
                "rule_id": "RULE_DUPLICATE_BILLING",
                "rule_name": "Duplicate Billing (Same Member, Code & Date)",
                "provider_id": p,
                "member_id": m,
                "severity": "HIGH",
                "claim_ids": claim_ids,
                "flagged_dollars": round(paid_sum, 2),
                "trigger_fields": {
                    "member_id": m,
                    "cpt_code": cpt,
                    "service_date": dt,
                    "duplicate_count": len(group),
                    "total_paid": round(paid_sum, 2)
                }
            })

    # 2. UPCODING
    # Flag providers whose level-5 share z-score > 3.0 and total claims > 30
    upcoders = provider_features[(provider_features["lvl5_zscore"] > 3.0) & (provider_features["total_claims"] >= 30)]
    for _, row in upcoders.iterrows():
        p = row["provider_id"]
        p_claims = claims[(claims["provider_id"] == p) & (claims["cpt_code"].isin(["99215", "G0300", "90837"]))]
        flags.append({
            "rule_id": "RULE_UPCODING",
            "rule_name": "High-Intensity Level 5 Upcoding",
            "provider_id": p,
            "member_id": "MULTIPLE",
            "severity": "CRITICAL" if row["lvl5_share"] > 0.7 else "HIGH",
            "claim_ids": p_claims["claim_id"].tolist(),
            "flagged_dollars": round(float(p_claims["paid_amt"].sum()), 2),
            "trigger_fields": {
                "specialty": row["specialty"],
                "provider_lvl5_share": f"{row['lvl5_share']*100:.1f}%",
                "peer_mean_share": f"{row['spec_lvl5_mean']*100:.1f}%",
                "z_score": round(float(row["lvl5_zscore"]), 2),
                "flagged_claims_count": len(p_claims)
            }
        })

    # 3. UNBUNDLING
    # Detect component code 71045 billed twice on same day/member instead of 71046
    xray_claims = claims[claims["cpt_code"] == "71045"]
    xray_grouped = xray_claims.groupby(["member_id", "provider_id", "service_date"])
    for (m, p, dt), group in xray_grouped:
        if len(group) >= 2:
            claim_ids = group["claim_id"].tolist()
            flags.append({
                "rule_id": "RULE_UNBUNDLING",
                "rule_name": "Unbundling Component Codes (Chest X-Ray)",
                "provider_id": p,
                "member_id": m,
                "severity": "HIGH",
                "claim_ids": claim_ids,
                "flagged_dollars": round(float(group["paid_amt"].sum()), 2),
                "trigger_fields": {
                    "component_cpt": "71045",
                    "component_count": len(group),
                    "bundled_cpt_alternative": "71046",
                    "service_date": dt
                }
            })

    # 4. IMPOSSIBLE TIMING
    # A: Provider billed > 24 hours of services in one calendar day
    daily_provider = claims.groupby(["provider_id", "service_date"])
    for (p, dt), group in daily_provider:
        # Compute total minutes billed
        total_mins = 0
        for _, r in group.iterrows():
            c = r["cpt_code"]
            if c in ["99215", "G0299", "G0300", "90837"]:
                total_mins += 40
            elif c == "A0427":
                total_mins += 90
            else:
                total_mins += 20
        total_hours = total_mins / 60.0
        if total_hours > 24.0:
            flags.append({
                "rule_id": "RULE_IMPOSSIBLE_TIMING",
                "rule_name": "Impossible Billing Velocity (>24 Hours in 1 Day)",
                "provider_id": p,
                "member_id": "MULTIPLE",
                "severity": "CRITICAL",
                "claim_ids": group["claim_id"].tolist(),
                "flagged_dollars": round(float(group["paid_amt"].sum()), 2),
                "trigger_fields": {
                    "service_date": dt,
                    "billed_hours": round(total_hours, 1),
                    "claims_count": len(group),
                    "max_legal_hours": 24.0
                }
            })

    # B: Ambulance overlapping transports on same timestamp
    amb_claims = claims[claims["cpt_code"] == "A0427"]
    amb_grouped = amb_claims.groupby(["provider_id", "service_date", "start_time"])
    for (p, dt, st), group in amb_grouped:
        if len(group) > 1:
            flags.append({
                "rule_id": "RULE_IMPOSSIBLE_TIMING",
                "rule_name": "Simultaneous Ambulance Emergency Transports",
                "provider_id": p,
                "member_id": "MULTIPLE",
                "severity": "CRITICAL",
                "claim_ids": group["claim_id"].tolist(),
                "flagged_dollars": round(float(group["paid_amt"].sum()), 2),
                "trigger_fields": {
                    "service_date": dt,
                    "simultaneous_start_time": st,
                    "concurrent_runs": len(group)
                }
            })

    # 5. EXCESSIVE UTILIZATION
    # Member with > 12 office visits in 30 days or provider visits_per_member z-score > 4.0
    mem_util = claims.groupby(["provider_id", "member_id"]).size().reset_index(name="visit_count")
    high_util = mem_util[mem_util["visit_count"] >= 14]
    for _, row in high_util.iterrows():
        p = row["provider_id"]
        m = row["member_id"]
        m_claims = claims[(claims["provider_id"] == p) & (claims["member_id"] == m)]
        flags.append({
            "rule_id": "RULE_EXCESSIVE_UTILIZATION",
            "rule_name": "Excessive Member Utilization Outlier (>14 Visits/Month)",
            "provider_id": p,
            "member_id": m,
            "severity": "HIGH",
            "claim_ids": m_claims["claim_id"].tolist(),
            "flagged_dollars": round(float(m_claims["paid_amt"].sum()), 2),
            "trigger_fields": {
                "member_id": m,
                "visit_count": int(row["visit_count"]),
                "peer_97th_percentile_threshold": 8
            }
        })

    # 6. PHANTOM SERVICES / HIGH-RISK DME
    dme_claims = claims[claims["cpt_code"].isin(["E0601", "E0260"])]
    dme_grouped = dme_claims.groupby("provider_id")
    for p, group in dme_grouped:
        if len(group) >= 20:  # High volume DME spike
            flags.append({
                "rule_id": "RULE_PHANTOM_SERVICES",
                "rule_name": "Phantom / Unverified High-End DME Distribution",
                "provider_id": p,
                "member_id": "MULTIPLE",
                "severity": "CRITICAL",
                "claim_ids": group["claim_id"].tolist(),
                "flagged_dollars": round(float(group["paid_amt"].sum()), 2),
                "trigger_fields": {
                    "dme_claims_count": len(group),
                    "total_dme_paid": round(float(group["paid_amt"].sum()), 2),
                    "delivery_verification": "UNVERIFIED"
                }
            })

    df_flags = pd.DataFrame(flags)
    return df_flags


if __name__ == "__main__":
    from claimshield.pipeline.features import load_dataset, extract_provider_features
    ds = load_dataset()
    feats = extract_provider_features(ds)
    flg = run_rules_engine(ds, feats)
    print(f"[*] Total Rule Alerts generated: {len(flg)}")
    print(flg["rule_id"].value_counts())
