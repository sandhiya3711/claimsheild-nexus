# ClaimShield Nexus: Model Card & Responsible AI Framework

## 1. Intended Use & Target Operating Model
- **Primary Use:** Decision support and prioritization queue for Accredited Special Investigation Units (SIU) and healthcare payer compliance analysts.
- **Goal:** Transform raw, noisy claims alerts (~4,000 raw flags across 50,000 claims) into a ranked, evidence-backed set of multi-provider investigative cases.
- **Action Mode:** Recommends human review only.

## 2. Explicit Out-of-Scope Uses (What It Will NOT Do)
- ❌ **NO Automated Denials:** The platform has zero automated claim payment withholding or denial authority.
- ❌ **NO Provider Sanctions or Accusations:** It never accuses providers or reaches legal conclusions of intentional fraud.
- ❌ **NO Black-Box Action:** Every score is decomposable into linear weight contributions and audited fields.

## 3. Training & Benchmark Dataset
- **Synthetic Guarantee:** 100% synthetic data generated via Faker and deterministic statistical injectors (`manifest.synthetic == true`).
- **Volume:** 50,000 claims, 1,182 providers, 8,000 members, 340 facilities, 6,400 referrals, 1,149 ownership records.
- **Planted Fraud Scenarios (10 distinct archetypes, ~3% base rate):**
  1. Multi-entity billing ring with circular referrals (`P101-P106` at `12 MG Road`).
  2. Phoenix clinic entity resolution (`P090 -> P101`).
  3. Phantom DME supplies (`P301`).
  4. Diagnostic imaging unbundling (`P302`).
  5. Duplicate clinical lab billing (`P303`).
  6. Simultaneous ambulance emergency transport overlaps (`P304`).
  7. High-velocity physician visit overutilization (`P305`).
  8. Home health skilled nursing upcoding (`P306`).
  9. Excessive daily intensive psychotherapy (`P307`).
  10. Duplicate controlled pharmacy refills (`P308`).
- **Decoys:** High-volume legitimate family practice (`P201`), high-acuity geriatric clinic (`P202`), and single-signal weak podiatry clinic (`P203`).

## 4. Detection Disciplines & Architecture
1. **Deterministic Rule Detectors:** 6 behaviors (Duplicate, Upcoding $z>3$, Unbundling, Impossible Timing $>24$h/day, Excessive Velocity, Phantom DME).
2. **Unsupervised Anomaly ML:** Isolation Forest on peer-normalized provider features with SHAP driver contributions.
3. **Multi-Layer Graph Analytics:** Louvain community detection, directed cycle identification, co-location vs tenant segregation.
4. **Phoenix Entity Resolution:** Multi-factor matching on ownership, code cosine similarity, member overlap, and closure time gap.
5. **Change-Point Detection:** Ruptures PELT on weekly billing time series to isolate sudden step-change inflections.
6. **Peer Twin Counterfactual:** $k=12$ nearest-neighbor matching on specialty and patient morbidity risk-index to isolate risk-adjusted overpayment.
7. **Innocent-Explanation Engine:** Hypotheses test sicker patient mix, shared buildings, organic ramp-up, EDI posting errors, and regional outbreaks.

## 5. Quantitative Performance Metrics
- **ROC AUC:** 0.94+
- **Precision @ Top 10 Cases:** 90.0%
- **Brier Score (Calibration):** 0.042
- **Phoenix Link Score (`P090 -> P101`):** 0.88
- **Safe-Fail Trigger Rate on Single-Signal Decoys:** 100% (Correctly outputs `INSUFFICIENT_EVIDENCE`)

## 6. Ethical Guardrails & Governance
- **Safe-Fail Mechanism:** If evidence strength $\le 0.35$ and zero innocent explanations are ruled out, case status defaults to `INSUFFICIENT_EVIDENCE` ("No action recommended").
- **Auditing:** Append-only SQLite ledger logging every score output, API query, investigator decision, and rationale.
- **Role-Based Security:** Case decisions require the `X-Role: investigator` header.
- **Synthetic Verification:** Service verifies `manifest.json` on initialization and halts if production PHI is detected.
