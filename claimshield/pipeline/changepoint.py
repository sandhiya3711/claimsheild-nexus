"""
ClaimShield Nexus: Change-Point Detection ("What Changed, and When").
Uses ruptures PELT algorithm on weekly billing time series to identify abrupt behavioral
step-changes, distinguishing sudden upcoding transitions from gradual clinic growth.
"""

from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import ruptures as rpt


def run_changepoint_analysis(dataset, provider_id):
    claims = dataset["claims"]
    p_claims = claims[claims["provider_id"] == provider_id].copy()

    if len(p_claims) < 15:
        return {
            "has_changepoint": False,
            "change_date": None,
            "pre_change_mean": 0.0,
            "post_change_mean": 0.0,
            "weekly_series": []
        }

    p_claims["service_date"] = pd.to_datetime(p_claims["service_date"])
    p_claims["week"] = p_claims["service_date"].dt.to_period("W").dt.start_time

    weekly = p_claims.groupby("week").agg(
        total_claims=("claim_id", "count"),
        lvl5_claims=("cpt_code", lambda s: (s.isin(["99215", "G0300", "90837"])).sum()),
        total_paid=("paid_amt", "sum")
    ).reset_index()

    weekly["lvl5_ratio"] = weekly["lvl5_claims"] / np.maximum(weekly["total_claims"], 1)
    weekly["week_str"] = weekly["week"].dt.strftime("%Y-%m-%d")

    # Time series signal for PELT
    signal = weekly["lvl5_ratio"].values
    weekly_list = []
    for _, r in weekly.iterrows():
        weekly_list.append({
            "week": r["week_str"],
            "total_claims": int(r["total_claims"]),
            "lvl5_claims": int(r["lvl5_claims"]),
            "lvl5_ratio": round(float(r["lvl5_ratio"]), 3),
            "total_paid": round(float(r["total_paid"]), 2)
        })

    if len(signal) < 4:
        return {
            "has_changepoint": False,
            "change_date": None,
            "pre_change_mean": float(np.mean(signal)),
            "post_change_mean": float(np.mean(signal)),
            "weekly_series": weekly_list
        }

    # Run PELT on L2 cost
    try:
        algo = rpt.Pelt(model="rbf", min_size=2, jump=1).fit(signal)
        # Choose penalty to isolate significant step shifts
        result = algo.predict(pen=1.5)
    except Exception:
        # Fallback variance shift detector
        diffs = np.abs(np.diff(signal))
        max_idx = int(np.argmax(diffs)) + 1
        result = [max_idx, len(signal)]

    # Filter out boundary endpoints
    cps = [idx for idx in result if 0 < idx < len(signal)]

    if cps:
        cp_idx = cps[0]
        # Find the biggest jump if multiple
        if len(cps) > 1:
            jumps = [abs(np.mean(signal[cps[i]:cps[i+1]]) - np.mean(signal[:cps[i]])) for i in range(len(cps)-1)]
            cp_idx = cps[np.argmax(jumps)] if jumps else cps[0]

        change_date = weekly.iloc[cp_idx]["week_str"]
        pre_mean = float(np.mean(signal[:cp_idx]))
        post_mean = float(np.mean(signal[cp_idx:]))
        has_cp = abs(post_mean - pre_mean) >= 0.35

        return {
            "has_changepoint": has_cp,
            "change_date": change_date if has_cp else None,
            "change_index": int(cp_idx),
            "pre_change_lvl5_share": round(pre_mean, 3),
            "post_change_lvl5_share": round(post_mean, 3),
            "shift_magnitude": round(post_mean - pre_mean, 3),
            "weekly_series": weekly_list,
            "summary_text": f"Abrupt step-change detected on {change_date}: level-5 share shifted from {pre_mean*100:.1f}% to {post_mean*100:.1f}% in a single week."
        }

    return {
        "has_changepoint": False,
        "change_date": None,
        "pre_change_lvl5_share": round(float(np.mean(signal)), 3),
        "post_change_lvl5_share": round(float(np.mean(signal)), 3),
        "shift_magnitude": 0.0,
        "weekly_series": weekly_list,
        "summary_text": "No abrupt structural change points detected; billing pattern is consistent across historical horizon."
    }


if __name__ == "__main__":
    from claimshield.pipeline.features import load_dataset
    ds = load_dataset()
    res = run_changepoint_analysis(ds, "P101")
    print("[*] P101 Change-Point Result:")
    print("    - Has ChangePoint:", res["has_changepoint"])
    print("    - Change Date:", res["change_date"])
    print("    - Shift:", f"{res['pre_change_lvl5_share']} -> {res['post_change_lvl5_share']}")
