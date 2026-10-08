"""
ClaimShield Nexus: Feature Engineering and Peer Normalization.
Computes provider-level aggregates, specialty peer baselines, code-mix entropy,
and patient risk-adjusted metrics.
"""

import math
import os
import duckdb
import numpy as np
import pandas as pd
from scipy.stats import entropy

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
DB_PATH = os.path.join(DATA_DIR, "claimshield.duckdb")


def load_dataset():
    con = duckdb.connect(DB_PATH)
    claims = con.execute("SELECT * FROM claims").fetchdf()
    providers = con.execute("SELECT * FROM providers").fetchdf()
    members = con.execute("SELECT * FROM members").fetchdf()
    facilities = con.execute("SELECT * FROM facilities").fetchdf()
    referrals = con.execute("SELECT * FROM referrals").fetchdf()
    ownership = con.execute("SELECT * FROM ownership").fetchdf()
    investigations = con.execute("SELECT * FROM investigations").fetchdf()
    con.close()
    return {
        "claims": claims,
        "providers": providers,
        "members": members,
        "facilities": facilities,
        "referrals": referrals,
        "ownership": ownership,
        "investigations": investigations
    }


def compute_code_entropy(cpt_series):
    counts = cpt_series.value_counts()
    if len(counts) <= 1:
        return 0.0
    return float(entropy(counts, base=2))


def extract_provider_features(dataset):
    claims = dataset["claims"]
    providers = dataset["providers"]
    members = dataset["members"]

    # Merge member risk index into claims
    claims_with_mem = claims.merge(members[["member_id", "risk_index", "region"]], on="member_id", how="left")
    claims_with_mem["risk_index"] = claims_with_mem["risk_index"].fillna(1.0)

    # Provider aggregations
    grouped = claims_with_mem.groupby("provider_id")

    provider_rows = []
    for pid, group in grouped:
        total_claims = len(group)
        unique_members = group["member_id"].nunique()
        total_billed = group["billed_amt"].sum()
        total_paid = group["paid_amt"].sum()
        avg_paid_per_claim = total_paid / max(total_claims, 1)
        visits_per_member = total_claims / max(unique_members, 1)

        # Level 5 share (CPT 99215 or G0300 or intensive codes)
        lvl5_claims = group[group["cpt_code"].isin(["99215", "G0300", "90837"])]
        lvl5_share = len(lvl5_claims) / max(total_claims, 1)

        # Code mix entropy
        code_entropy = compute_code_entropy(group["cpt_code"])

        # Patient average risk index
        avg_patient_risk = group["risk_index"].mean()

        # Maximum daily billed hours estimate (assuming ~40 min for lvl5, 20 min lvl3/4, 90 min ambulance)
        daily_claims = group.groupby("service_date").size()
        max_daily_claims = daily_claims.max() if len(daily_claims) > 0 else 0

        provider_rows.append({
            "provider_id": pid,
            "total_claims": total_claims,
            "unique_members": unique_members,
            "total_billed": round(total_billed, 2),
            "total_paid": round(total_paid, 2),
            "avg_paid_per_claim": round(avg_paid_per_claim, 2),
            "visits_per_member": round(visits_per_member, 2),
            "lvl5_share": round(lvl5_share, 4),
            "code_entropy": round(code_entropy, 4),
            "avg_patient_risk": round(avg_patient_risk, 3),
            "max_daily_claims": int(max_daily_claims)
        })

    df_prov_feat = pd.DataFrame(provider_rows)

    # Merge provider metadata
    merged = providers.merge(df_prov_feat, on="provider_id", how="left").fillna({
        "total_claims": 0,
        "unique_members": 0,
        "total_billed": 0.0,
        "total_paid": 0.0,
        "avg_paid_per_claim": 0.0,
        "visits_per_member": 0.0,
        "lvl5_share": 0.0,
        "code_entropy": 0.0,
        "avg_patient_risk": 1.0,
        "max_daily_claims": 0
    })

    # Specialty peer baselines
    specialty_stats = merged.groupby("specialty").agg(
        spec_lvl5_mean=("lvl5_share", "mean"),
        spec_lvl5_std=("lvl5_share", "std"),
        spec_paid_mean=("avg_paid_per_claim", "mean"),
        spec_paid_std=("avg_paid_per_claim", "std"),
        spec_vpm_mean=("visits_per_member", "mean"),
        spec_vpm_std=("visits_per_member", "std")
    ).reset_index().fillna(0.01)

    merged = merged.merge(specialty_stats, on="specialty", how="left")

    # Z-scores
    merged["lvl5_zscore"] = (merged["lvl5_share"] - merged["spec_lvl5_mean"]) / np.maximum(merged["spec_lvl5_std"], 0.01)
    merged["paid_zscore"] = (merged["avg_paid_per_claim"] - merged["spec_paid_mean"]) / np.maximum(merged["spec_paid_std"], 0.01)
    merged["vpm_zscore"] = (merged["visits_per_member"] - merged["spec_vpm_mean"]) / np.maximum(merged["spec_vpm_std"], 0.01)

    return merged


if __name__ == "__main__":
    ds = load_dataset()
    feats = extract_provider_features(ds)
    print(f"Computed features for {len(feats)} providers.")
    p101 = feats[feats["provider_id"] == "P101"]
    print("P101 Features:", p101[["provider_id", "lvl5_share", "lvl5_zscore", "total_paid", "avg_patient_risk"]].to_dict(orient="records"))
