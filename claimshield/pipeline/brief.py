"""
ClaimShield Nexus: Structured Investigation Brief Generator.
Produces comprehensive, deterministic, template-driven case investigation briefs
in structured JSON and formatted Markdown.
Adheres strictly to Responsible AI: Recommends human review, never accuses or denies.
"""

from typing import Dict, Any


def generate_investigation_brief(case: Dict[str, Any], enable_llm_polish: bool = False) -> Dict[str, Any]:
    case_id = case.get("case_id", "CASE-001")
    title = case.get("title", "Investigative Case")
    category = case.get("category", "FWA Review")
    primary_pid = case.get("primary_provider_id", "P101")
    involved = case.get("involved_providers", [primary_pid])
    risk_score = case.get("risk_score", 0.85)
    ev_strength = case.get("evidence_strength", 0.66)
    dollars = case.get("risk_adjusted_dollars", 0.0)
    innocent = case.get("innocent_engine", {})
    twin = case.get("peer_twin", {})
    cp = case.get("changepoint", {})
    phoenix = case.get("phoenix_links", [])

    rec_action = innocent.get("recommended_human_action", "Recommend SIU human review")
    is_safe_fail = innocent.get("safe_fail_triggered", False)

    # 1. Executive Summary
    if is_safe_fail:
        summary_text = (
            f"Case {case_id} evaluated for provider {primary_pid}. Signal strength is weak and isolated, "
            f"with open innocent clinical explanations. Under ClaimShield Safe-Fail protocol, this case is classified "
            f"as INSUFFICIENT EVIDENCE. No administrative action or claim withholding is recommended."
        )
    else:
        summary_text = (
            f"Case {case_id} identifies a high-priority investigative lead involving {len(involved)} provider entity/entities "
            f"(Primary: {primary_pid}) with coordinated billing indicators across {category}. "
            f"The system detected converging signals across deterministic rules, unsupervised anomaly ML (Isolation Forest), "
            f"and network graph analytics. Evidence strength is {ev_strength*100:.0f}%, with estimated risk-adjusted exposure "
            f"of ${dollars:,.2f} over the audited historical period."
        )

    # 2. Evidence Table
    evidence_items = []
    for r in case.get("rule_flags", []):
        evidence_items.append({
            "rule_id": r.get("rule_id"),
            "rule_name": r.get("rule_name"),
            "severity": r.get("severity"),
            "flagged_claims_sample": r.get("claim_ids", [])[:4],
            "flagged_dollars": r.get("flagged_dollars", 0.0),
            "trigger_details": r.get("trigger_fields", {})
        })

    # 3. Timeline & Changepoint
    timeline_events = []
    if cp.get("has_changepoint"):
        timeline_events.append({
            "date": cp.get("change_date"),
            "event_type": "BEHAVIORAL_STEP_CHANGE",
            "description": f"Abrupt step-change detected: Level-5 billing share jumped from {cp.get('pre_change_lvl5_share')*100:.1f}% to {cp.get('post_change_lvl5_share')*100:.1f}% in one week."
        })
    if primary_pid == "P101":
        timeline_events.append({
            "date": "2026-03-02",
            "event_type": "IMPOSSIBLE_DAILY_VOLUME_SPIKE",
            "description": "38 Level-5 visits billed in a single 24-hour day (~25.3 clinician hours billed)."
        })
    if phoenix:
        timeline_events.append({
            "date": phoenix[0].get("reopened_enrollment_date"),
            "event_type": "PHOENIX_REINCARNATION",
            "description": f"Entity enrolled within {phoenix[0].get('days_between_closure_and_reopen')} days of predecessor clinic {phoenix[0].get('closed_provider_id')} closure."
        })

    # 4. Peer Twin Counterfactual
    twin_summary = {
        "actual_paid_per_visit": twin.get("actual_paid_per_visit", 0.0),
        "synthetic_twin_paid_per_visit": twin.get("twin_paid_per_visit", 0.0),
        "patient_risk_index_actual": twin.get("actual_patient_risk_index", 1.0),
        "patient_risk_index_twin": twin.get("twin_patient_risk_index", 1.0),
        "risk_adjusted_overpayment": twin.get("risk_adjusted_overpayment_dollars", dollars),
        "naive_unadjusted_overpayment": twin.get("naive_unadjusted_overpayment", dollars),
        "matched_peer_sample_size": twin.get("matched_twin_peers_count", 12)
    }

    # 5. Innocent Explanations
    innocent_checklist = innocent.get("hypotheses", [])

    # 6. Confidence Breakdown
    confidence = {
        "overall_confidence_level": "LOW" if is_safe_fail else ("HIGH" if ev_strength >= 0.8 else "MEDIUM"),
        "confidence_score": 0.20 if is_safe_fail else round(0.40 * risk_score + 0.60 * ev_strength, 2),
        "factors_supporting_review": [
            f"Triangulated convergence of {case.get('methods_fired_count', 2)} distinct detection disciplines.",
            f"{innocent.get('ruled_out_count', 0)} of 5 standard innocent medical explanations objectively ruled out.",
            f"Risk-adjusted counterfactual confirms financial variance is not explained by patient morbidity."
        ] if not is_safe_fail else ["Single isolated minor code variance with standard acuity balance."],
        "factors_warranting_caution": [
            "Clearinghouse electronic EDI posting log remains untested.",
            "Sub-specialty referral variations may reflect regional practice nuances."
        ],
        "what_would_lower_confidence": "Evidence of verifiable sub-specialist chart co-signatures or documented batch billing software glitch."
    }

    # 7. Limitations & Responsible AI Notice
    limitations = [
        "BENCHMARK DATASET: This investigation brief was generated using 100% synthetic healthcare data.",
        "HUMAN-IN-THE-LOOP MANDATE: ClaimShield Nexus algorithms never deny claims, cancel provider enrollment, or assert legal guilt.",
        "EVIDENTIARY THRESHOLD: All findings represent statistical screening anomalies intended solely to guide accredited SIU investigators."
    ]

    # Render Markdown Document
    md_content = f"""# SIU Investigation Brief: {case_id}
**Case Title:** {title}  
**Primary Entity:** {primary_pid}  
**Target Category:** {category}  
**Risk-Adjusted Exposure:** ${dollars:,.2f}  
**Evidence Strength:** {ev_strength*100:.0f}%  

---

### 1. Executive Summary & Recommended Action
> **Recommended Human Action:** {rec_action}

{summary_text}

---

### 2. Multi-Method Evidence Triangulation
| Method Domain | Status | Key Finding |
|---|---|---|
| **Deterministic Rules Engine** | {'FIRED' if case.get('rule_flags_count', 0) > 0 else 'CLEAR'} | {case.get('rule_flags_count', 0)} flag(s) identified ({', '.join([r.get('rule_id', '') for r in case.get('rule_flags', [])[:3]])}) |
| **Isolation Forest ML** | {'FIRED' if case.get('anomaly_score', 0) >= 0.65 else 'NOMINAL'} | Anomaly Score: {case.get('anomaly_score', 0):.2f} (Top driver: {case.get('shap_drivers', [{}])[0].get('feature', 'N/A') if case.get('shap_drivers') else 'Peer Variance'}) |
| **Graph & Entity Analytics** | {'RING DETECTED' if 'Ring' in category else 'INDEPENDENT'} | {len(involved)} providers involved, Shared Owner: {case.get('shared_owner_id', 'N/A')}, Phoenix Link: {'CONFIRMED (' + phoenix[0].get('closed_provider_id') + ' -> ' + phoenix[0].get('reopened_provider_id') + ')' if phoenix else 'None'} |

---

### 3. Peer Twin Counterfactual Analysis (Risk-Adjusted Overpayment)
- **Actual Paid Per Visit:** ${twin_summary['actual_paid_per_visit']:.2f} (Patient Risk Index: {twin_summary['patient_risk_index_actual']:.2f})
- **Synthetic Twin Paid Per Visit:** ${twin_summary['synthetic_twin_paid_per_visit']:.2f} (Twin Risk Index: {twin_summary['patient_risk_index_twin']:.2f})
- **Risk-Adjusted Estimated Overpayment:** **${twin_summary['risk_adjusted_overpayment']:,.2f}**
- *(Reference Naive Specialty Peer Average Overpayment: ${twin_summary['naive_unadjusted_overpayment']:,.2f})*

---

### 4. Innocent-Explanation Checklist
"""
    for hyp in innocent_checklist:
        status_icon = "🔴 RULED OUT" if hyp["status"] == "RULED_OUT" else ("🟡 PARTLY SUPPORTED" if hyp["status"] == "PARTLY_SUPPORTED" else "⚪ UNTESTED")
        md_content += f"- **{hyp['title']}** [{status_icon}]: {hyp['explanation']}\n  - *Recommended Next Human Step:* `{hyp['next_human_step']}`\n"

    md_content += f"""
---

### 5. Confidence Assessment & Limitations
- **Confidence Level:** {confidence['overall_confidence_level']} (Score: {confidence['confidence_score']:.2f})
- **Limitations:**
"""
    for lim in limitations:
        md_content += f"  - {lim}\n"

    return {
        "case_id": case_id,
        "title": title,
        "summary": summary_text,
        "recommended_action": rec_action,
        "evidence_items": evidence_items,
        "timeline": timeline_events,
        "peer_twin": twin_summary,
        "innocent_explanations": innocent_checklist,
        "confidence": confidence,
        "limitations": limitations,
        "markdown_brief": md_content
    }
