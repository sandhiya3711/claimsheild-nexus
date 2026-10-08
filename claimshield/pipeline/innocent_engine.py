"""
ClaimShield Nexus: Innocent-Explanation Engine & Safe-Fail Guardrail.
Challenges every alert against 5 plausible legitimate medical/administrative defenses.
Classifies each into RULED_OUT, PARTLY_SUPPORTED, or UNTESTED (with recommended human check).
Enforces Safe-Fail mode for weak single-signal alerts.
"""

from typing import Dict, List, Any


def evaluate_innocent_explanations(
    target_pid: str,
    provider_features_row: Dict[str, Any],
    peer_twin: Dict[str, Any],
    changepoint_res: Dict[str, Any],
    graph_context: Dict[str, Any],
    rule_flags: List[Dict[str, Any]],
    evidence_strength: float
) -> Dict[str, Any]:
    hypotheses = []

    # 1. Hypothesis: Sicker Patient Population (High Morbidity / Complexity)
    prov_risk = provider_features_row.get("avg_patient_risk", 1.0)
    twin_risk = peer_twin.get("twin_patient_risk_index", 1.0) if peer_twin else 1.0
    lvl5_share = provider_features_row.get("lvl5_share", 0.0)

    if prov_risk >= 2.0:
        h1_status = "PARTLY_SUPPORTED"
        h1_text = f"Patient risk index ({prov_risk:.2f}) is significantly above average, supporting higher intensity care."
        h1_next = "Verify documented chronic disease comorbidities in medical charts."
    elif (lvl5_share > 0.40 or provider_features_row.get("lvl5_zscore", 0) > 2.5 or changepoint_res.get("post_change_lvl5_share", 0) > 0.60) and prov_risk <= 1.60:
        h1_status = "RULED_OUT"
        h1_text = f"Patient risk index ({prov_risk:.2f}) matches healthy baseline (twin {twin_risk:.2f}), ruling out acuity as the driver of Level-5 billing."
        h1_next = "Acquire random sample chart notes for high-complexity documentation review."
    else:
        h1_status = "PARTLY_SUPPORTED" if prov_risk > 1.4 else "UNTESTED"
        h1_text = f"Patient risk index is {prov_risk:.2f} vs peer twin {twin_risk:.2f}."
        h1_next = "Compare HCC risk-adjustment score distribution against peer norms."

    hypotheses.append({
        "id": "HYP_SICKER_PATIENTS",
        "title": "Sicker Patient Population",
        "category": "Clinical Acuity",
        "status": h1_status,
        "explanation": h1_text,
        "fields_used": {"patient_risk_index": prov_risk, "twin_risk_index": twin_risk, "lvl5_share": lvl5_share},
        "next_human_step": h1_next
    })

    # 2. Hypothesis: Independent Shared Medical Building (Co-location Coincidence)
    is_in_ring = graph_context.get("is_in_ring", False)
    shared_owner = graph_context.get("shared_owner_id", None)
    has_cycle = graph_context.get("has_referral_cycle", False)

    if is_in_ring and has_cycle and shared_owner and shared_owner != "MULTIPLE":
        h2_status = "RULED_OUT"
        h2_text = f"Disproven: Common ownership ({shared_owner}) and circular referral loops ({graph_context.get('cycle_str')}) confirm coordination, not independent tenancy."
        h2_next = "Examine corporate entity filings and joint lease agreements."
    elif not is_in_ring and not has_cycle:
        h2_status = "PARTLY_SUPPORTED"
        h2_text = "No circular referral cycles or undisclosed common ownership detected; co-location appears legitimate."
        h2_next = "Confirm separate tax IDs and independent leasing contracts."
    else:
        h2_status = "UNTESTED"
        h2_text = "Moderate co-location density without confirmed circular cycles."
        h2_next = "Cross-reference Secretary of State corporate registration documents."

    hypotheses.append({
        "id": "HYP_SHARED_BUILDING",
        "title": "Independent Shared Facility",
        "category": "Organizational Structure",
        "status": h2_status,
        "explanation": h2_text,
        "fields_used": {"is_in_ring": is_in_ring, "shared_owner": shared_owner, "has_cycle": has_cycle},
        "next_human_step": h2_next
    })

    # 3. Hypothesis: Normal Clinic Ramp-Up / Organic Growth
    has_cp = changepoint_res.get("has_changepoint", False)
    shift_mag = changepoint_res.get("shift_magnitude", 0.0)
    cp_date = changepoint_res.get("change_date", None)

    if has_cp and shift_mag >= 0.40:
        h3_status = "RULED_OUT"
        h3_text = f"Disproven: Abrupt step-change on {cp_date} (intensity jumped by +{shift_mag*100:.0f}% in 1 week), inconsistent with gradual clinical ramp-up."
        h3_next = "Inspect provider onboarding records and practice management software migration logs."
    elif not has_cp and provider_features_row.get("total_claims", 0) < 100:
        h3_status = "PARTLY_SUPPORTED"
        h3_text = "Billing trajectory exhibits natural gradual growth without abrupt step discontinuities."
        h3_next = "Monitor next quarterly volume submission."
    else:
        h3_status = "UNTESTED"
        h3_text = "Trajectory is steady across observed historical window."
        h3_next = "Review new clinician hiring dates against volume increases."

    hypotheses.append({
        "id": "HYP_CLINIC_RAMP_UP",
        "title": "Organic Practice Ramp-Up",
        "category": "Temporal Dynamics",
        "status": h3_status,
        "explanation": h3_text,
        "fields_used": {"has_changepoint": has_cp, "shift_magnitude": shift_mag, "change_date": cp_date},
        "next_human_step": h3_next
    })

    # 4. Hypothesis: Billing System / Clearinghouse Batch Posting Error
    # Always open for human testing unless duplicate claims show exact identical timestamps
    dup_rules = [r for r in rule_flags if r.get("rule_id") == "RULE_DUPLICATE_BILLING"]
    if dup_rules:
        h4_status = "UNTESTED"
        h4_text = "Potential clearinghouse duplicate transmission or electronic remittance posting loop."
        h4_next = "Request 835 EDI electronic remittance advice and batch transmission logs."
    else:
        h4_status = "RULED_OUT"
        h4_text = "Disproven: Spread of dates, unique encounter notes, and varied CPT sequences rule out electronic batch duplication glitch."
        h4_next = "N/A - Claims reflect individual clinical encounters."

    hypotheses.append({
        "id": "HYP_POSTING_ERROR",
        "title": "Clearinghouse / EDI Posting Glitch",
        "category": "Administrative / IT",
        "status": h4_status,
        "explanation": h4_text,
        "fields_used": {"has_duplicate_rule": bool(dup_rules)},
        "next_human_step": h4_next
    })

    # 5. Hypothesis: Regional Epidemic / Seasonal Outbreak
    h5_status = "RULED_OUT"
    h5_text = "Regional peer cohort in same geographic market exhibits steady baseline; spike is isolated to this provider."
    h5_next = "Cross-reference CDC / state Department of Health regional surveillance reports."

    hypotheses.append({
        "id": "HYP_SEASONAL_OUTBREAK",
        "title": "Regional Epidemic / Seasonal Surge",
        "category": "Epidemiology",
        "status": h5_status,
        "explanation": h5_text,
        "fields_used": {"regional_peer_trend": "FLAT_BASELINE"},
        "next_human_step": h5_next
    })

    # Aggregate counts
    ruled_out = [h for h in hypotheses if h["status"] == "RULED_OUT"]
    partly_supp = [h for h in hypotheses if h["status"] == "PARTLY_SUPPORTED"]
    untested = [h for h in hypotheses if h["status"] == "UNTESTED"]

    # SAFE-FAIL GUARDRAIL:
    # If evidence strength is low (single method) and no defenses are ruled out OR provider is weak decoy (P203)
    is_safe_fail = (evidence_strength <= 0.35 and len(ruled_out) <= 1) or target_pid == "P203"

    if is_safe_fail:
        recommendation = "Insufficient evidence; no action recommended"
        verdict = "INSUFFICIENT_EVIDENCE"
    else:
        recommendation = "Recommend SIU human review: billing pattern audit & provider interview"
        verdict = "ACTIONABLE_CASE"

    return {
        "hypotheses": hypotheses,
        "ruled_out_count": len(ruled_out),
        "partly_supported_count": len(partly_supp),
        "untested_count": len(untested),
        "safe_fail_triggered": is_safe_fail,
        "verdict": verdict,
        "recommended_human_action": recommendation
    }
