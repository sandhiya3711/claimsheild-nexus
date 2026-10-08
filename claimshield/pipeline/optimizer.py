"""
ClaimShield Nexus: Capacity Optimizer & Knapsack Resource Allocation.
Maximizes expected recoverable dollars (Probability of Substantiation x Risk-Adjusted Dollars)
under investigator team capacity constraints (Cases or Analyst Hours budget).
Calculates monotonic dollar coverage curves across capacity levels.
"""

from typing import List, Dict, Any


def run_capacity_optimization(cases: List[Dict[str, Any]], capacity_cases: int = 10, total_analyst_hours: int = 160) -> Dict[str, Any]:
    # Estimate complexity hours & P(valid) per case
    case_items = []
    total_pipeline_dollars = sum(float(c.get("risk_adjusted_dollars", 0.0)) for c in cases)

    for c in cases:
        ev = float(c.get("evidence_strength", 0.33))
        risk = float(c.get("risk_score", 0.5))
        dollars = float(c.get("risk_adjusted_dollars", 0.0))
        is_safe_fail = c.get("innocent_engine", {}).get("safe_fail_triggered", False)

        p_valid = 0.05 if is_safe_fail else min(0.95, 0.40 * risk + 0.60 * ev)
        exp_recovery = round(p_valid * dollars, 2)

        # Estimate hours
        if "Ring" in c.get("category", "") or len(c.get("involved_providers", [])) > 1:
            hours = 24
        elif ev >= 0.66:
            hours = 16
        else:
            hours = 8

        case_items.append({
            "case_id": c.get("case_id"),
            "title": c.get("title"),
            "category": c.get("category"),
            "priority_score": c.get("priority_score", 0.5),
            "risk_adjusted_dollars": dollars,
            "p_substantiated": round(p_valid, 2),
            "expected_recoverable_dollars": exp_recovery,
            "required_investigation_hours": hours,
            "dollar_yield_per_hour": round(exp_recovery / max(hours, 1), 2)
        })

    # Greedy knapsack sorted by yield per hour
    case_items.sort(key=lambda x: x["dollar_yield_per_hour"], reverse=True)

    # 1. Selection by Case Capacity (Top N cases)
    selected_by_cases = case_items[:capacity_cases]
    covered_dollars_cases = sum(x["risk_adjusted_dollars"] for x in selected_by_cases)
    exp_recov_cases = sum(x["expected_recoverable_dollars"] for x in selected_by_cases)

    # 2. Monotonic Coverage Curve across capacities N=1 to 15
    coverage_curve = []
    running_dollars = 0.0
    for n in range(1, min(16, len(case_items) + 1)):
        running_dollars += case_items[n - 1]["risk_adjusted_dollars"]
        pct = (running_dollars / total_pipeline_dollars * 100.0) if total_pipeline_dollars > 0 else 0.0
        coverage_curve.append({
            "capacity_cases": n,
            "dollars_covered": round(running_dollars, 2),
            "pct_total_coverage": round(pct, 1)
        })

    return {
        "requested_capacity": capacity_cases,
        "total_pipeline_cases": len(cases),
        "total_pipeline_dollars": round(total_pipeline_dollars, 2),
        "selected_cases_count": len(selected_by_cases),
        "dollars_covered": round(covered_dollars_cases, 2),
        "percent_dollars_covered": round((covered_dollars_cases / total_pipeline_dollars * 100.0) if total_pipeline_dollars > 0 else 0.0, 1),
        "expected_recoverable_yield": round(exp_recov_cases, 2),
        "allocated_analyst_hours": sum(x["required_investigation_hours"] for x in selected_by_cases),
        "selected_cases": selected_by_cases,
        "coverage_curve": coverage_curve
    }
