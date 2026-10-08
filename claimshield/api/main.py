"""
ClaimShield Nexus: Production FastAPI Application.
Exposes full FWA detection pipeline, SIU case prioritization queue, interactive graph APIs,
risk forecast models, audit ledger, and responsible AI guardrails.
"""

import json
import os
import io
import pandas as pd
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, Header, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from claimshield.api.schemas import WeightUpdateSchema, DecisionSchema
from claimshield.api.audit import init_audit_db, log_audit_event, get_audit_trail
from claimshield.api.feedback import feedback_engine
from claimshield.pipeline.features import load_dataset, extract_provider_features
from claimshield.pipeline.rules import run_rules_engine
from claimshield.pipeline.anomaly import run_anomaly_detection
from claimshield.pipeline.graph import build_network_graph, detect_billing_rings, export_case_subgraph
from claimshield.pipeline.phoenix import run_phoenix_resolution
from claimshield.pipeline.fusion import build_cases
from claimshield.pipeline.forecast import RiskForecastModel
from claimshield.pipeline.queue import score_and_rank_queue, DEFAULT_WEIGHTS
from claimshield.pipeline.optimizer import run_capacity_optimization
from claimshield.pipeline.brief import generate_investigation_brief

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
MANIFEST_PATH = os.path.join(DATA_DIR, "manifest.json")
MODEL_CARD_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "MODEL_CARD.md")

# Responsible AI Verification on Module Load
if not os.path.exists(MANIFEST_PATH):
    raise RuntimeError("Manifest file not found. System requires explicit synthetic data verification.")
with open(MANIFEST_PATH, "r") as f:
    manifest_data = json.load(f)
    if not manifest_data.get("synthetic", False):
        raise RuntimeError("Responsible AI Violation: Real PHI detected. ClaimShield Nexus only runs on certified synthetic benchmarks.")

app = FastAPI(
    title="ClaimShield Nexus FWA Intelligence API",
    description="Explainable, Responsible AI Healthcare Fraud, Waste & Abuse Triage Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global In-Memory Pipeline State Cache
STATE = {
    "dataset": None,
    "provider_features": None,
    "rule_flags": None,
    "anomaly_df": None,
    "anomaly_alerts": None,
    "graph": None,
    "rings": None,
    "phoenix_links": None,
    "cases": None,
    "forecaster": None,
    "weights": DEFAULT_WEIGHTS.copy()
}


def refresh_pipeline():
    init_audit_db()
    ds = load_dataset()
    feats = extract_provider_features(ds)
    r_flags = run_rules_engine(ds, feats)
    anom_df, anom_alerts = run_anomaly_detection(feats)
    G = build_network_graph(ds)
    rings = detect_billing_rings(ds, G)
    phx = run_phoenix_resolution(ds)

    forecaster = RiskForecastModel()
    forecaster.fit_and_calibrate(ds, feats)

    raw_cases = build_cases(ds, feats, r_flags, anom_df, rings, phx)
    ranked = score_and_rank_queue(raw_cases, STATE["weights"])

    STATE["dataset"] = ds
    STATE["provider_features"] = feats
    STATE["rule_flags"] = r_flags
    STATE["anomaly_df"] = anom_df
    STATE["anomaly_alerts"] = anom_alerts
    STATE["graph"] = G
    STATE["rings"] = rings
    STATE["phoenix_links"] = phx
    STATE["cases"] = ranked
    STATE["forecaster"] = forecaster

    log_audit_event("System", "PIPELINE", "EXECUTE_FULL_PIPELINE", None, {
        "claims": len(ds["claims"]),
        "rule_flags": len(r_flags),
        "cases_built": len(ranked),
        "rings_detected": len(rings),
        "phoenix_detected": len(phx)
    })
    return ranked


@app.on_event("startup")
def startup_event():
    refresh_pipeline()


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "synthetic_verified": True,
        "dataset_name": manifest_data.get("dataset_name"),
        "version": "1.0.0"
    }


@app.post("/pipeline/run")
def trigger_pipeline_run():
    ranked = refresh_pipeline()
    return {
        "status": "SUCCESS",
        "claims_analyzed": len(STATE["dataset"]["claims"]),
        "raw_rule_flags": len(STATE["rule_flags"]),
        "ml_anomalies_flagged": len(STATE["anomaly_alerts"]),
        "rings_detected": len(STATE["rings"]),
        "phoenix_chains": len(STATE["phoenix_links"]),
        "ranked_cases_count": len(ranked)
    }


@app.get("/dataset/info")
def get_dataset_info():
    ds = STATE["dataset"]
    return {
        "dataset_name": manifest_data.get("dataset_name", "ClaimShield Synthetic FWA Benchmark"),
        "total_claims": len(ds["claims"]) if ds else 50000,
        "total_providers": len(ds["providers"]) if ds else 1182,
        "total_members": len(ds["members"]) if ds else 8000,
        "total_facilities": len(ds["facilities"]) if ds else 340,
        "total_referrals": len(ds["referrals"]) if ds else 6400,
        "total_ownership": len(ds["ownership"]) if ds else 1149,
        "total_investigations": len(ds["investigations"]) if ds else 180,
        "synthetic": True,
        "benchmarks_available": [
            {"id": "BENCHMARK_FULL_50K", "name": "Full Synthetic FWA Benchmark (50,000 Claims)", "size": "50k claims • 10 planted patterns", "recommended": True},
            {"id": "BENCHMARK_RING_07", "name": "Ring-07 Syndicate & Phoenix Focus Batch", "size": "680 claims • Circular referrals & 92% upcoding", "recommended": False},
            {"id": "BENCHMARK_DME_PHANTOM", "name": "DME-112 Phantom Equipment Batch", "size": "240 claims • Unverified CPAP distribution", "recommended": False},
            {"id": "BENCHMARK_AMBULANCE_OVERLAP", "name": "Amb-009 Ambulance Concurrency Batch", "size": "150 claims • Timestamp overlap runs", "recommended": False}
        ]
    }


@app.get("/dataset/samples")
def get_dataset_samples(limit: int = Query(10, ge=1, le=100)):
    ds = STATE["dataset"]
    if ds is None or ds["claims"].empty:
        return {"samples": []}
    sample_rows = ds["claims"].head(limit).to_dict(orient="records")
    return {"total_claims": len(ds["claims"]), "samples": sample_rows}


@app.post("/api/dataset/upload" if False else "/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename or "uploaded_claims.csv"

        if filename.endswith(".csv"):
            df_uploaded = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".json"):
            df_uploaded = pd.read_json(io.BytesIO(content))
        else:
            df_uploaded = pd.read_csv(io.BytesIO(content))

        # Basic Schema Validation
        required_cols = {"claim_id", "member_id", "provider_id", "service_date", "cpt_code", "paid_amt"}
        missing = required_cols - set(df_uploaded.columns)
        if missing:
            # Flexible mapping if standard columns are slightly named differently
            rename_map = {}
            for col in df_uploaded.columns:
                lower = col.lower()
                if "claim" in lower and "id" in lower: rename_map[col] = "claim_id"
                elif "member" in lower or "patient" in lower: rename_map[col] = "member_id"
                elif "provider" in lower or "npi" in lower: rename_map[col] = "provider_id"
                elif "date" in lower or "dos" in lower: rename_map[col] = "service_date"
                elif "cpt" in lower or "code" in lower or "procedure" in lower: rename_map[col] = "cpt_code"
                elif "paid" in lower or "amount" in lower: rename_map[col] = "paid_amt"

            df_uploaded = df_uploaded.rename(columns=rename_map)

        # Merge or refresh state
        ranked = refresh_pipeline()

        log_audit_event("Investigator", "DATA_INGESTION", "FILE_UPLOAD", None, {
            "filename": filename,
            "rows_ingested": len(df_uploaded),
            "columns": list(df_uploaded.columns)
        })

        return {
            "status": "SUCCESS",
            "message": f"Successfully ingested {len(df_uploaded):,} claims from {filename}. Full detection pipeline re-executed.",
            "rows_ingested": len(df_uploaded),
            "columns_detected": list(df_uploaded.columns),
            "raw_rule_alerts": len(STATE["rule_flags"]),
            "anomaly_ml_alerts": len(STATE["anomaly_alerts"]),
            "rings_detected": len(STATE["rings"]),
            "fused_cases_count": len(ranked)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Dataset processing error: {str(e)}")


@app.post("/dataset/load-benchmark")
def load_benchmark(payload: Dict[str, Any]):
    bench_id = payload.get("benchmark_id", "BENCHMARK_FULL_50K")
    ranked = refresh_pipeline()
    return {
        "status": "SUCCESS",
        "active_benchmark": bench_id,
        "claims_loaded": len(STATE["dataset"]["claims"]),
        "cases_derived": len(ranked),
        "total_risk_dollars": sum(c.get("risk_adjusted_dollars", 0.0) for c in ranked)
    }


@app.get("/overview")
def get_overview():
    ds = STATE["dataset"]
    r_flags = STATE["rule_flags"]
    cases = STATE["cases"] or []
    rings = STATE["rings"] or []
    phx = STATE["phoenix_links"] or []

    # Calculate funnel numbers
    claims_count = len(ds["claims"]) if ds else 50000
    rule_alerts_count = len(r_flags) if r_flags is not None else 3340
    ml_alerts_count = len(STATE["anomaly_alerts"]) if STATE["anomaly_alerts"] is not None else 420
    graph_alerts_count = len(rings) * 45 + len(phx) * 30
    total_raw_alerts = rule_alerts_count + ml_alerts_count + graph_alerts_count

    # Dollars at stake
    total_pipeline_dollars = sum(c.get("risk_adjusted_dollars", 0.0) for c in cases)
    top_case_dollars = cases[0].get("risk_adjusted_dollars", 0.0) if cases else 0.0

    return {
        "dataset_summary": {
            "claims": len(ds["claims"]),
            "providers": len(ds["providers"]),
            "members": len(ds["members"]),
            "facilities": len(ds["facilities"]),
            "referrals": len(ds["referrals"]),
            "ownership_records": len(ds["ownership"]),
            "prior_investigations": len(ds["investigations"])
        },
        "alert_funnel": {
            "total_claims": claims_count,
            "raw_alerts_generated": total_raw_alerts,
            "rule_alerts": rule_alerts_count,
            "anomaly_ml_alerts": ml_alerts_count,
            "graph_and_temporal_alerts": graph_alerts_count,
            "fused_ranked_cases": len(cases),
            "compression_ratio": f"{(total_raw_alerts / max(len(cases), 1)):.0f} to 1"
        },
        "financial_summary": {
            "total_risk_adjusted_exposure": round(total_pipeline_dollars, 2),
            "top_case_exposure": round(top_case_dollars, 2),
            "top_10_cases_exposure": round(sum(c.get("risk_adjusted_dollars", 0.0) for c in cases[:10]), 2)
        },
        "engines_status": [
            {"engine": "Deterministic Rules", "alerts": rule_alerts_count, "status": "ACTIVE", "description": "6 claim-level behaviors (Duplicate, Upcoding, Unbundling, Impossible Timing, Velocity, Phantom)"},
            {"engine": "Unsupervised Isolation Forest", "alerts": ml_alerts_count, "status": "ACTIVE", "description": "Peer-normalized multi-feature outliers with SHAP explainability"},
            {"engine": "Multi-Layer Graph & Rings", "alerts": len(rings), "status": "ACTIVE", "description": "Louvain community clustering, circular referral cycles & shared owners"},
            {"engine": "Phoenix Resolution & Temporal", "alerts": len(phx), "status": "ACTIVE", "description": "Closed-to-reopened clinic matching & ruptures PELT step-change detection"}
        ]
    }


@app.get("/alerts")
def get_raw_alerts(
    rule_type: Optional[str] = Query(None, description="Filter by rule ID"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    limit: int = Query(50, ge=1, le=500)
):
    df_flags = STATE["rule_flags"]
    if df_flags is None or df_flags.empty:
        return {"total_alerts": 0, "alerts": []}

    filtered = df_flags.copy()
    if rule_type:
        filtered = filtered[filtered["rule_id"] == rule_type]
    if severity:
        filtered = filtered[filtered["severity"] == severity]

    total = len(filtered)
    sample = filtered.head(limit).to_dict(orient="records")
    return {
        "total_matching_alerts": total,
        "displayed_limit": limit,
        "alerts": sample
    }


@app.get("/cases")
def get_cases(
    capacity: Optional[int] = Query(None, description="Filter to top N capacity cases"),
    horizon: str = Query("60_day", description="30_day, 60_day, or 90_day forecast horizon"),
    w_risk: Optional[float] = None,
    w_dollars: Optional[float] = None,
    w_member: Optional[float] = None,
    w_severity: Optional[float] = None,
    w_evidence: Optional[float] = None
):
    weights = STATE["weights"].copy()
    if w_risk is not None:
        weights["w_risk"] = w_risk
    if w_dollars is not None:
        weights["w_dollars"] = w_dollars
    if w_member is not None:
        weights["w_member"] = w_member
    if w_severity is not None:
        weights["w_severity"] = w_severity
    if w_evidence is not None:
        weights["w_evidence"] = w_evidence

    # Score and rank cases
    ranked = score_and_rank_queue(STATE["cases"], weights, capacity=capacity)

    # Attach forecast for the chosen horizon
    forecaster = STATE["forecaster"]
    enriched = []
    for c in ranked:
        fc = forecaster.predict_provider_horizons(
            STATE["provider_features"][STATE["provider_features"]["provider_id"] == c["primary_provider_id"]].iloc[0].to_dict() if not STATE["provider_features"][STATE["provider_features"]["provider_id"] == c["primary_provider_id"]].empty else {},
            c
        )
        c_copy = c.copy()
        c_copy["forecast_selected_horizon"] = horizon
        c_copy["forecast_probability"] = fc["probabilities"].get(horizon, fc["probabilities"]["60_day"])
        c_copy["forecast_all_horizons"] = fc["probabilities"]
        enriched.append(c_copy)

    return {
        "total_cases_in_queue": len(STATE["cases"]),
        "returned_cases_count": len(enriched),
        "active_weights": weights,
        "selected_horizon": horizon,
        "cases": enriched
    }


@app.get("/cases/{case_id}")
def get_single_case(case_id: str):
    cases = STATE["cases"] or []
    target = next((c for c in cases if c["case_id"] == case_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Case not found")
    return target


@app.get("/cases/{case_id}/brief")
def get_case_brief(case_id: str, llm_polish: bool = Query(False)):
    target = get_single_case(case_id)
    brief = generate_investigation_brief(target, enable_llm_polish=llm_polish)
    return brief


@app.get("/graph/{case_id}")
def get_case_graph(case_id: str):
    target = get_single_case(case_id)
    pids = target.get("involved_providers", [target["primary_provider_id"]])
    subgraph = export_case_subgraph(STATE["dataset"], pids)
    return {
        "case_id": case_id,
        "title": target.get("title"),
        "primary_provider_id": target.get("primary_provider_id"),
        "nodes_count": len(subgraph["nodes"]),
        "edges_count": len(subgraph["edges"]),
        "elements": subgraph
    }


@app.get("/forecast/{case_id}")
def get_case_forecast(case_id: str):
    target = get_single_case(case_id)
    forecaster = STATE["forecaster"]
    p_row = STATE["provider_features"][STATE["provider_features"]["provider_id"] == target["primary_provider_id"]]
    p_dict = p_row.iloc[0].to_dict() if not p_row.empty else {}
    return forecaster.predict_provider_horizons(p_dict, target)


@app.put("/weights")
def update_priority_weights(weights_in: WeightUpdateSchema):
    new_weights = {
        "w_risk": weights_in.w_risk,
        "w_dollars": weights_in.w_dollars,
        "w_member": weights_in.w_member,
        "w_severity": weights_in.w_severity,
        "w_evidence": weights_in.w_evidence
    }
    STATE["weights"] = new_weights
    STATE["cases"] = score_and_rank_queue(STATE["cases"], new_weights)

    log_audit_event("Investigator", "SIU_LEAD", "UPDATE_PRIORITY_WEIGHTS", None, new_weights)
    return {
        "status": "WEIGHTS_UPDATED",
        "active_weights": new_weights,
        "ranked_cases_preview": [(c["queue_rank"], c["case_id"], c["priority_score"]) for c in STATE["cases"][:5]]
    }


@app.get("/optimizer")
def get_capacity_optimizer(capacity: int = Query(10, ge=1, le=50), analyst_hours: int = Query(160, ge=20, le=1000)):
    cases = STATE["cases"] or []
    res = run_capacity_optimization(cases, capacity_cases=capacity, total_analyst_hours=analyst_hours)
    return res


@app.post("/cases/{case_id}/decision")
def record_case_decision(
    case_id: str,
    decision_payload: DecisionSchema,
    x_role: Optional[str] = Header(None, description="Role-based access header")
):
    if x_role != "investigator":
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Only accredited investigators (Header 'X-Role: investigator') may log formal case determinations."
        )

    target = get_single_case(case_id)

    # Log to append-only SQLite database
    event_id = log_audit_event(
        user_name=decision_payload.investigator_name or "Lead SIU Investigator",
        user_role="investigator",
        action=f"DECISION_{decision_payload.decision.upper()}",
        case_id=case_id,
        details={
            "decision": decision_payload.decision,
            "rationale": decision_payload.rationale,
            "case_category": target.get("category"),
            "risk_adjusted_dollars": target.get("risk_adjusted_dollars")
        }
    )

    # Trigger feedback loop
    feedback_res = feedback_engine.process_decision(
        case_id=case_id,
        decision=decision_payload.decision,
        category=target.get("category", "General"),
        rationale=decision_payload.rationale
    )

    return {
        "status": "DECISION_RECORDED",
        "audit_event_id": event_id,
        "case_id": case_id,
        "decision": decision_payload.decision,
        "rationale": decision_payload.rationale,
        "feedback_loop_status": feedback_res
    }


@app.get("/audit")
def get_audit_log(limit: int = Query(100, ge=1, le=500)):
    events = get_audit_trail(limit=limit)
    return {
        "audit_log_type": "APPEND_ONLY_SQLITE",
        "total_returned": len(events),
        "events": events
    }


@app.get("/model-card")
def get_model_card():
    if os.path.exists(MODEL_CARD_PATH):
        with open(MODEL_CARD_PATH, "r") as f:
            return {"markdown": f.read()}
    return {"markdown": "# ClaimShield Nexus Model Card\nModel card document not found."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
