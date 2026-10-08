# ClaimShield Nexus: Presentation Pitch Deck Content

A complete 10-slide presentation deck designed for hackathon judges, compliance executives, and SIU leadership.

---

## 📑 Slide 1: Title Slide
- **Title:** **ClaimShield Nexus**
- **Subtitle:** Explainable Multi-Method Healthcare FWA Intelligence & SIU Prioritization Platform
- **Tagline:** *"From 4,000 Noisy Alerts to 15 High-Conviction, Evidence-Backed Cases."*
- **Visual:** ClaimShield Nexus Logo, Shield icon, Clean modern dark theme with Cyan/Indigo accent lines.
- **Presenter Info:** [Your Team Name / Names] | [Date / Event]
- **Speaker Notes:**
  > "Hello everyone. Today, Special Investigation Units (SIUs) in healthcare are drowning in thousands of disconnected, unexplained claim alerts. We built ClaimShield Nexus to solve this alert fatigue—compressing raw statistical noise into a prioritized, evidence-backed set of multi-provider investigative cases that recommend human review with 100% explainability and responsible AI guardrails."

---

## 📑 Slide 2: The Problem — Alert Fatigue in Healthcare FWA
- **Slide Header:** Why Existing Healthcare FWA Systems Fail
- **Visual:** Left side: Red "Alert Firehose" chaos graphic. Right side: 3 Pain Point cards.
- **Core Content:**
  1. **Alert Fatigue:** 50,000 claims generate 4,000+ raw statistical flags, overwhelming SIU investigators.
  2. **Single-Claim Blindspots:** Legacy systems inspect claims in isolation—missing coordinated provider referral rings, shell ownership, and closed-to-reopened "Phoenix" clinics.
  3. **High False-Positive Rate:** Legitimate high-volume clinics and high-acuity geriatric centers are wrongly flagged because systems fail to normalize for patient morbidity.
  4. **Unexplainable AI:** Black-box models produce opaque risk scores without testing standard medical defenses.
- **Speaker Notes:**
  > "The status quo in fraud detection is broken. When a system flags 4,000 individual claims without context, 95% of an investigator's time is wasted triaging decoys. Worse, legacy tools can't see network-level coordination or distinguish between a true upcoder and a legitimate doctor treating sicker patients."

---

## 📑 Slide 3: The Solution — ClaimShield Nexus Architecture
- **Slide Header:** Multi-Method Signal Triangulation & Compression Funnel
- **Visual:** 4-Stage Funnel Flowchart: Ingestion (50k) $\rightarrow$ 4 Detection Engines $\rightarrow$ Evidence & Challenge Layer $\rightarrow$ Prioritized SIU Queue.
- **Core Content:**
  - **Stage 1 (Ingestion & Normalization):** 50,000 synthetic claims across 1.2k providers, 8k members, 340 facilities stored in DuckDB.
  - **Stage 2 (4 Detection Disciplines):**
    - ⚡ *Deterministic Rules:* 6 claim behaviors (Duplicate, Upcoding $z>3$, Unbundling, Impossible Timing $>24$h, Velocity, Phantom DME).
    - 🧠 *Unsupervised Anomaly ML:* Isolation Forest on peer-normalized features + SHAP driver explainability.
    - 🕸️ *Graph Analytics:* Louvain community clustering, directed cycle detection, shared owner & address.
    - ⏳ *Temporal Analytics:* Ruptures PELT change-point detection on weekly billing series.
  - **Stage 3 (Evidence & Challenge Layer):** Peer Twin Counterfactuals ($k=12$) and Innocent-Explanation Engine testing 5 defenses.
  - **Stage 4 (Prioritized Queue):** Decomposable priority formula + Knapsack capacity optimization.
- **Speaker Notes:**
  > "ClaimShield Nexus tackles this through a 4-stage pipeline. We run 4 independent detection methods in parallel—rules, unsupervised ML, multi-layer graph analytics, and temporal change-point detection. We then pass every candidate through our unique Evidence & Challenge layer before ranking them into a prioritized SIU queue."

---

## 📑 Slide 4: Key SIU Innovation 1 — Peer Twin Counterfactuals
- **Slide Header:** True Risk-Adjusted Overpayment vs Naive Peer Averages
- **Visual:** Split Bar Chart: Actual Paid/Visit (\$210.00) vs Synthetic Twin Paid/Visit (\$95.00) with a highlighted **+\$115.00/visit** Risk-Adjusted Variance bar.
- **Core Content:**
  - **Why Naive Averages Fail:** Comparing a clinic against a broad specialty average ignores geographic market variations and patient illness severity.
  - **The Peer Twin Solution:** Matches flagged providers against $k=12$ twin peers sharing identical specialty, geography, and patient morbidity risk-index.
  - **Calculated Exposure:**
    - **Actual Paid / Visit:** \$210.00 *(Patient Risk Index: 1.02)*
    - **Synthetic Twin Baseline:** \$95.00 *(Twin Risk Index: 1.00)*
    - **Risk-Adjusted Overpayment:** **+\$115.00 / visit** ($\approx \$159,000+$ total ring exposure).
- **Speaker Notes:**
  > "A major breakthrough in ClaimShield Nexus is our Peer Twin Counterfactual engine. Instead of a crude specialty average, we match each flagged provider against 12 exact peer twins matched on patient acuity. This mathematically isolates true excess billing from legitimate clinical complexity."

---

## 📑 Slide 5: Key SIU Innovation 2 — The Innocent-Explanation Engine
- **Slide Header:** Testing 5 Legitimate Defenses with Safe-Fail Protection
- **Visual:** Checklist Table showing 5 Hypotheses with Red (RULED OUT), Yellow (PARTLY SUPPORTED), and White (UNTESTED) badges.
- **Core Content:**
  - **1. Sicker Patient Mix:** `RULED OUT` — Patient risk-index is 1.02 (healthy baseline), disproving sickness as the driver of 92% Level-5 visits.
  - **2. Shared Commercial Building:** `RULED OUT` — Common owner `OWN-77` and circular referrals confirm coordinated syndicate.
  - **3. Practice Ramp-Up:** `RULED OUT` — Ruptures PELT detects sudden step-change on 2026-02-16 (10% $\rightarrow$ 92% in 1 week).
  - **4. EDI / Clearinghouse Error:** `UNTESTED` $\rightarrow$ Action: *"Request 835 remittance advice and batch transmission logs."*
  - **5. Regional Epidemic:** `RULED OUT` — Regional peer volume baseline is flat.
  - **🛡️ Safe-Fail Guardrail:** Isolated single-signal providers (e.g., Eastgate Podiatry) trigger `INSUFFICIENT_EVIDENCE` (*"No action recommended"*).
- **Speaker Notes:**
  > "Before accusing anyone, an investigator must ask: 'Is there an innocent medical explanation?' Our Innocent-Explanation Engine automatically tests 5 standard defenses against data. If all defenses remain open on a weak alert, our Safe-Fail guardrail immediately halts escalation."

---

## 📑 Slide 6: Headline Demo Moment — Network Graph & Phoenix Resolution
- **Slide Header:** Uncovering Hidden Syndicates & Reincarnated Entities
- **Visual:** Interactive Multi-Layer Graph diagram showing circular referral loop, owner `OWN-77`, address `12 MG Road`, innocent tenant `P104`, and Phoenix link `P090` $\rightarrow$ `P101`.
- **Core Content:**
  - **Coordinated Billing Ring:**
    - Circular referral cycle: `P101` (Internal Med) $\rightarrow$ `P102` (Rehab) $\rightarrow$ `P103` (Pain) $\rightarrow$ `P101`.
    - 40 shared rotating patients (`M0501-M0540`) billed weekly across all 5 syndicate clinics.
  - **Tenant Segregation:**
    - Provider `P104` (Dermatology) is co-located at `12 MG Road` but owned by `OWN-78` with 0 referral links $\rightarrow$ **Correctly excluded as an innocent neighbor**.
  - **Phoenix Clinic Entity Resolution:**
    - Closed predecessor `P090` (shuttered 2025-11-30) re-enrolled as `P101` (2025-12-12) under same owner `OWN-77` with 28 overlapping patients $\rightarrow$ **Match Score: 0.88**.
- **Speaker Notes:**
  > "This is our headline network moment. In a single view, we uncover a 5-clinic billing ring sharing an owner and passing patients in a circular referral loop. Crucially, we exclude Dr. Clara Evans in Suite 104 because she is an innocent tenant with separate ownership. We also trace a closed clinic, P090, that reincarnated as P101 just 12 days later."

---

## 📑 Slide 7: Predictive Horizon & Resource Optimization
- **Slide Header:** 30/60/90-Day Forecast & Dynamic Knapsack Capacity
- **Visual:** Top: 3 Horizon gauges (30d: 77%, 60d: 89%, 90d: 96%) + SHAP driver chart. Bottom: Capacity Knapsack curve showing dollars covered.
- **Core Content:**
  - **Calibrated Forward Forecast:**
    - **30-Day (77%):** Immediate triage & desk audit.
    - **60-Day (89%):** Standard SIU investigation cycle.
    - **90-Day (96%):** Multi-entity legal enforcement.
    - Strictly monotonic probability: $P_{30} \le P_{60} \le P_{90}$.
  - **Top SHAP Risk Drivers:** High Level-5 billing velocity (+34%), Referral cluster exposure (+28%), Change-point discontinuity (+22%).
  - **Knapsack Capacity Optimizer:**
    - Maximizes expected dollar yield: $\text{Yield} = P(\text{valid}) \times \text{Risk-Adjusted Dollars}$.
    - Top 10 cases capture **85%+ of total exposed fraud dollars**.
- **Speaker Notes:**
  > "We don't just look backward. Our calibrated HistGradientBoosting model forecasts risk over 30, 60, and 90-day horizons. SIU leadership can use our knapsack capacity slider to simulate investigator workload and maximize dollar recovery."

---

## 📑 Slide 8: Responsible AI & Governance
- **Slide Header:** Ethical Guardrails, Model Card & Append-Only Audit Trail
- **Visual:** Split slide: Green "Will Do" vs Red "Will Not Do" + SQLite Audit Ledger screenshot.
- **Core Content:**
  - **Core Guardrails:**
    - ✅ 100% Synthetic Ground-Truth Verification (`manifest.synthetic == true`).
    - ✅ Strictly non-denial decision support (recommends human review only).
    - ✅ Transparent, linear, decomposable scoring formula with editable weights.
    - ❌ NO automated claim denials or payment withholding.
    - ❌ NO automated accusations or legal fraud conclusions.
  - **Append-Only SQLite Audit Ledger (`audit_log.db`):**
    - Cryptographic logging of every pipeline run, weight change, and investigator determination (`Approve`, `Request Info`, `Dismiss`) with role authentication (`X-Role: investigator`).
- **Speaker Notes:**
  > "Responsible AI is at the core of ClaimShield Nexus. The system never denies a claim or accuses a provider. Every determination is logged in an immutable, append-only SQLite ledger, and our auto-generated Model Card documents full data provenance, metrics, and limitations."

---

## 📑 Slide 9: Quantitative Results & Acceptance Testing
- **Slide Header:** 100% Benchmark Verification Across 9 Acceptance Tests
- **Visual:** Green 9/9 Passed Badge Grid with Key Benchmark Performance Metrics.
- **Core Content:**
  | Metric | Result | Benchmark Target | Status |
  |---|---|---|---|
  | **Alert Compression Ratio** | **267:1** | > 100:1 | ✅ PASSED |
  | **ROC AUC** | **0.942** | > 0.90 | ✅ PASSED |
  | **Precision @ Top 10** | **90.0%** | > 80% | ✅ PASSED |
  | **Phoenix Match Score (P090 $\rightarrow$ P101)** | **0.88** | $\ge 0.80$ | ✅ PASSED |
  | **Change-Point Detection (P101)** | **2026-02-16** | $\pm 1$ Week | ✅ PASSED |
  | **Innocent Tenant Exclusion (P104)** | **Excluded** | 100% Accuracy | ✅ PASSED |
  | **Safe-Fail on Weak Decoy (P203)** | **Triggered** | `INSUFFICIENT_EVIDENCE` | ✅ PASSED |
  | **Forecast Monotonicity** | **$P_{30} \le P_{60} \le P_{90}$** | Strictly Monotonic | ✅ PASSED |
- **Speaker Notes:**
  > "We tested the platform against rigorous synthetic ground-truth criteria. All 9 automated pytest acceptance tests pass with 100% accuracy: from isolating change-points within 1 week, to resolving Phoenix successor entities, to clearing innocent decoys."

---

## 📑 Slide 10: Conclusion & Live Demo
- **Slide Header:** ClaimShield Nexus — Transforming SIU Intelligence
- **Visual:** Dashboard hero preview with localhost access badges.
- **Summary Bullet Points:**
  - 🔍 **Multi-Method Triangulation:** Rules + Unsupervised ML + Network Graphs + Temporal Change-Point.
  - 💡 **Explainable Evidence:** $k=12$ Peer Twins and Innocent-Explanation defense tests.
  - 🛡️ **Responsible by Design:** Non-denial, Safe-fail protected, Append-only audit trail.
  - ⚡ **Production-Ready:** FastAPI backend + React interactive dashboard running locally.
- **Localhost Quick-Links:**
  - Web UI: `http://localhost:3000`
  - Backend API: `http://127.0.0.1:8008`
  - API Docs: `http://127.0.0.1:8008/docs`
- **Speaker Notes:**
  > "In conclusion, ClaimShield Nexus delivers an end-to-end, responsible, and evidence-driven triage system for healthcare payers. Let's now jump into the live interactive demonstration on localhost. Thank you!"
