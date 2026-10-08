"""
ClaimShield Nexus: SIU Queue Prioritization Engine.
Calculates transparent, decomposable priority scores based on configurable weights:
Priority = w_risk * Risk + w_dollars * Dollars + w_member * Member_Impact + w_severity * Severity + w_evidence * Evidence_Strength.
Supports dynamic re-ranking and capacity filtering.
"""

from typing import Dict, List, Any


DEFAULT_WEIGHTS = {
    "w_risk": 0.30,
    "w_dollars": 0.20,
    "w_member": 0.15,
    "w_severity": 0.15,
    "w_evidence": 0.20
}

DOLLAR_CAP = 250000.0  # Dollars normalization reference cap


def score_and_rank_queue(cases: List[Dict[str, Any]], weights: Dict[str, float] = None, capacity: int = None) -> List[Dict[str, Any]]:
    if weights is None:
        weights = DEFAULT_WEIGHTS.copy()

    # Normalize weights so sum = 1.0
    w_sum = sum(weights.values())
    if w_sum <= 0:
        w_norm = {k: 0.20 for k in DEFAULT_WEIGHTS}
    else:
        w_norm = {k: v / w_sum for k, v in weights.items()}

    scored_cases = []
    for c in cases:
        risk = float(c.get("risk_score", 0.5))
        dollars = float(c.get("risk_adjusted_dollars", 0.0))
        dollars_factor = min(1.0, dollars / DOLLAR_CAP)
        member_impact = float(c.get("member_impact_score", 0.5))
        sev_score = float(c.get("severity_score", 0.5))
        evidence = float(c.get("evidence_strength", 0.33))

        # Check safe fail
        is_safe_fail = c.get("innocent_engine", {}).get("safe_fail_triggered", False)

        if is_safe_fail:
            priority = 0.10 + (risk * 0.05)
        else:
            priority = (
                w_norm.get("w_risk", 0.30) * risk +
                w_norm.get("w_dollars", 0.20) * dollars_factor +
                w_norm.get("w_member", 0.15) * member_impact +
                w_norm.get("w_severity", 0.15) * sev_score +
                w_norm.get("w_evidence", 0.20) * evidence
            )

        scored_cases.append({
            **c,
            "priority_score": round(float(priority), 4),
            "score_breakdown": {
                "risk_contribution": round(w_norm.get("w_risk", 0.30) * risk, 3),
                "dollars_contribution": round(w_norm.get("w_dollars", 0.20) * dollars_factor, 3),
                "member_contribution": round(w_norm.get("w_member", 0.15) * member_impact, 3),
                "severity_contribution": round(w_norm.get("w_severity", 0.15) * sev_score, 3),
                "evidence_contribution": round(w_norm.get("w_evidence", 0.20) * evidence, 3),
                "active_weights": w_norm
            }
        })

    # Sort descending by priority score
    scored_cases.sort(key=lambda x: x["priority_score"], reverse=True)

    # Assign queue ranks
    for rank, sc in enumerate(scored_cases, 1):
        sc["queue_rank"] = rank

    if capacity is not None and capacity > 0:
        return scored_cases[:capacity]

    return scored_cases


if __name__ == "__main__":
    sample_cases = [
        {"case_id": "CASE-001", "risk_score": 0.94, "risk_adjusted_dollars": 145000, "member_impact_score": 0.9, "severity_score": 0.95, "evidence_strength": 1.0},
        {"case_id": "CASE-002", "risk_score": 0.20, "risk_adjusted_dollars": 5000, "member_impact_score": 0.2, "severity_score": 0.2, "evidence_strength": 0.33, "innocent_engine": {"safe_fail_triggered": True}}
    ]
    res = score_and_rank_queue(sample_cases)
    print("Ranked cases:", [(c["case_id"], c["priority_score"]) for c in res])
