# ClaimShield Nexus: Healthcare FWA Intelligence & SIU Prioritization

**ClaimShield Nexus** is an explainable, multi-method Fraud, Waste, and Abuse (FWA) detection and Special Investigation Unit (SIU) prioritization platform. It compresses ~4,000 raw claim alerts across 50,000 synthetic claims down to a ranked, evidence-backed set of ~15 high-conviction cases.

---

## 🏛️ System Architecture

```text
SYNTHETIC DATA SOURCES
  claims (50k) · providers (1.2k) · members (8k) · facilities (340) ·
  referrals (6.4k) · ownership (1.15k) · prior investigations (180)
        │
        ▼
[1] DATA ENGINEERING
  ingest + validate → DuckDB store → provider feature tables →
  specialty peer baselines + patient morbidity risk index
        │
        ▼
[2] DETECTION ENGINES (Parallel)
  ├─ Deterministic Rules ... Duplicate · Upcoding · Unbundling · Impossible Timing · Excessive Velocity · Phantom DME
  ├─ Anomaly ML ............ Isolation Forest on peer-normalized features + SHAP drivers
  ├─ Graph Analytics ....... Louvain communities · referral loops · shared owner / address · Phoenix entity resolution
  └─ Temporal Analytics .... Ruptures PELT step-change detection ("what changed, and when")
        │
        ▼
[3] EVIDENCE & CHALLENGE LAYER
  ├─ Peer Twin Counterfactual .... k=12 risk-adjusted overpayment gap vs naive average
  └─ Innocent-Explanation Engine . 5 medical/operational defense tests (Ruled Out / Partly Supported / Untested)
        │
        ▼
[4] FUSION & CASE BUILDER
  Multi-signal triangulation · evidence strength (1-3 methods) · multi-entity ring & phoenix grouping
        │
        ├──────────────────────────────┐
        ▼                              ▼
[5] FORECAST 30 / 60 / 90      [6] SIU PRIORITIZATION
  Calibrated HistGradientBoosting priority = w₁·Risk + w₂·Dollars + w₃·Member + w₄·Severity + w₅·Evidence
  monotonic p30 <= p60 <= p90    capacity slider & knapsack dollar coverage optimizer
        └──────────────┬──────────────┘
                       ▼
[7] BRIEF GENERATOR
  Evidence · timeline · network context · peer twin · defenses · confidence · limitations
        │
        ▼
[8] FASTAPI + REACT DASHBOARD
  Overview · Claim Alerts · SIU Queue · Case Brief · Network Graph · Risk Forecast · Responsible AI
        │
        ▼
[9] HUMAN DETERMINATION & AUDIT
  Approve for review · Request info · Dismiss ──► Append-only SQLite Audit Ledger ──► Feedback Loop
```

---

## 🚀 Quick Start Guide

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Synthetic Benchmark Dataset
```bash
python claimshield/data/generate_data.py
```

### 3. Run Pytest Acceptance Tests
```bash
pytest claimshield/tests/test_acceptance.py -v
```

### 4. Start FastAPI Backend (Port 8000)
```bash
python -m uvicorn claimshield.api.main:app --host 127.0.0.1 --port 8000 --reload
```

### 5. Start React Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000** in your browser to interact with the full dashboard.

---

## 🌟 Core Features & SIU Add-ons

1. **Peer Twin Counterfactual Engine:** Builds a synthetic twin from $k=12$ peers matched on specialty, region, and patient morbidity risk-index to compute true risk-adjusted overpayment.
2. **Innocent-Explanation Engine & Safe-Fail Guardrail:** Systematically tests 5 plausible defenses (Sicker patients, Shared medical building, Organic ramp-up, EDI posting error, Regional outbreak). Weak single-signal providers (e.g. Eastgate Podiatry) trigger Safe-Fail (`INSUFFICIENT_EVIDENCE`, no action recommended).
3. **Phoenix Clinic Entity Resolution:** Weighted multi-factor matching (owner match, code cosine similarity, patient overlap, closure gap) linking closed clinic `P090` with reopened clinic `P101` (Score ~0.88).
4. **Coordinated Network Ring Detection:** Uncovers circular referral loops (`P101 -> P102 -> P103 -> P101`) sharing owner `OWN-77` at `12 MG Road`, while correctly excluding innocent tenant `P104`.
5. **Dynamic SIU Capacity Slider & Editable Weights:** Live knapsack dollar coverage calculation and real-time formula re-ranking.
6. **30 / 60 / 90-Day Predictive Risk Horizon:** Calibrated forward risk recurrence with SHAP feature explanations and strictly monotonic probabilities ($P_{30} \le P_{60} \le P_{90}$).
7. **Append-Only SQLite Audit Ledger:** Cryptographic traceability for all system outputs and human investigator determinations with role checks (`X-Role: investigator`).
8. **Guided Demo Pitch Mode:** 8-step interactive walk-through with presenter script cues for rapid 3-4 minute demonstrations.
