"""
ClaimShield Nexus: Synthetic Data Generator with Injected Fraud Scenarios and Decoys.
Generates 50,000 claims, 1,200 providers, 8,000 members, 340 facilities, 6,400 referrals,
1,150 ownership links, and 180 prior investigations.
Ground truth is preserved in ground_truth.json.
All entities and records are 100% synthetic.
"""

import json
import os
import random
from datetime import datetime, timedelta
import duckdb
import numpy as np
import pandas as pd
from faker import Faker

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)
fake = Faker()
Faker.seed(RANDOM_SEED)

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DATA_DIR, "claimshield.duckdb")
GROUND_TRUTH_PATH = os.path.join(DATA_DIR, "ground_truth.json")

SPECIALTIES = [
    "Internal Medicine", "Family Practice", "Cardiology", "Dermatology",
    "Orthopedics", "Radiology", "DME Supplier", "Home Health",
    "Ambulance", "Behavioral Health", "Podiatry", "Pathology/Lab", "Pharmacy"
]

REGIONS = ["Northeast", "Midwest", "South", "West", "Pacific"]
AGE_BANDS = ["0-17", "18-34", "35-49", "50-64", "65-79", "80+"]

CPT_DESCRIPTIONS = {
    # Evaluation & Management
    "99211": {"desc": "Office visit lvl 1", "type": "Professional", "rvu": 0.5, "base_price": 45.0, "time_min": 10},
    "99212": {"desc": "Office visit lvl 2", "type": "Professional", "rvu": 1.0, "base_price": 75.0, "time_min": 15},
    "99213": {"desc": "Office visit lvl 3", "type": "Professional", "rvu": 1.6, "base_price": 110.0, "time_min": 20},
    "99214": {"desc": "Office visit lvl 4", "type": "Professional", "rvu": 2.4, "base_price": 165.0, "time_min": 30},
    "99215": {"desc": "Office visit lvl 5 (High Complexity)", "type": "Professional", "rvu": 3.5, "base_price": 240.0, "time_min": 40},
    # Lab & Pathology
    "80053": {"desc": "Comprehensive metabolic panel", "type": "Lab", "rvu": 0.8, "base_price": 65.0, "time_min": 5},
    "85025": {"desc": "Complete CBC with diff", "type": "Lab", "rvu": 0.6, "base_price": 45.0, "time_min": 5},
    "80061": {"desc": "Lipid panel", "type": "Lab", "rvu": 0.7, "base_price": 55.0, "time_min": 5},
    # Imaging
    "71045": {"desc": "Chest X-ray single view", "type": "Radiology", "rvu": 0.9, "base_price": 85.0, "time_min": 15},
    "71046": {"desc": "Chest X-ray 2 views (bundled)", "type": "Radiology", "rvu": 1.4, "base_price": 130.0, "time_min": 20},
    "73721": {"desc": "MRI joint lower extremity", "type": "Radiology", "rvu": 4.2, "base_price": 520.0, "time_min": 45},
    # DME
    "E0601": {"desc": "CPAP Device continuous pressure", "type": "DME", "rvu": 5.0, "base_price": 1250.0, "time_min": 30},
    "E0260": {"desc": "Semi-electric hospital bed", "type": "DME", "rvu": 6.5, "base_price": 1850.0, "time_min": 60},
    # Ambulance
    "A0427": {"desc": "Ambulance ALS emergency transport", "type": "Ambulance", "rvu": 4.5, "base_price": 890.0, "time_min": 90},
    "A0425": {"desc": "Ambulance ground mileage per mile", "type": "Ambulance", "rvu": 0.3, "base_price": 18.0, "time_min": 5},
    # Home Health
    "G0299": {"desc": "Direct skilled nursing home health", "type": "Home Health", "rvu": 2.0, "base_price": 195.0, "time_min": 60},
    "G0300": {"desc": "Direct skilled therapy home health", "type": "Home Health", "rvu": 2.2, "base_price": 210.0, "time_min": 60},
    # Behavioral Health
    "90834": {"desc": "Psychotherapy 45 min", "type": "Behavioral", "rvu": 1.9, "base_price": 140.0, "time_min": 45},
    "90837": {"desc": "Psychotherapy 60 min intensive", "type": "Behavioral", "rvu": 2.8, "base_price": 210.0, "time_min": 60},
    # Pharmacy
    "J0585": {"desc": "Botulinum toxin injection unit", "type": "Pharmacy", "rvu": 1.5, "base_price": 310.0, "time_min": 15},
    "NDC-9901": {"desc": "Specialty Controlled Rx 30-day", "type": "Pharmacy", "rvu": 1.0, "base_price": 420.0, "time_min": 5}
}


def generate_all():
    print("[*] Generating ClaimShield Nexus Synthetic Dataset...")

    # 1. Members (8,000)
    members = []
    for i in range(1, 8001):
        mid = f"M{i:04d}"
        age_b = random.choice(AGE_BANDS)
        reg = random.choice(REGIONS)
        # Risk index: log-normal or gamma around 1.0
        r_idx = float(np.clip(np.random.lognormal(mean=-0.05, sigma=0.35), 0.25, 4.0))
        members.append({
            "member_id": mid,
            "name": fake.name(),
            "age_band": age_b,
            "region": reg,
            "risk_index": round(r_idx, 2)
        })
    df_members = pd.DataFrame(members)

    # 2. Facilities (340)
    facilities = []
    # Key Ring Facility
    facilities.append({
        "facility_id": "F100",
        "name": "MG Metro Medical Complex",
        "address": "12 MG Road",
        "type": "Multi-Specialty Clinic"
    })
    for i in range(2, 341):
        fid = f"F{i:03d}"
        ftype = random.choice(["Hospital Outpatient", "Independent Clinic", "Diagnostic Imaging Center",
                               "Ambulatory Surgical Center", "Skilled Nursing Facility", "DME Depot"])
        facilities.append({
            "facility_id": fid,
            "name": f"{fake.city()} {ftype}",
            "address": f"{random.randint(100, 9999)} {fake.street_name()}",
            "type": ftype
        })
    df_facilities = pd.DataFrame(facilities)

    # 3. Ownership (1,150)
    # OWN-77 owns P101, P102, P103, P105, P106, and closed predecessor P090
    # OWN-78 owns P104 (innocent tenant)
    ownership_records = [
        {"owner_id": "OWN-77", "owner_name": "Apex Syndicate Group LLC", "provider_id": "P101", "facility_id": "F100"},
        {"owner_id": "OWN-77", "owner_name": "Apex Syndicate Group LLC", "provider_id": "P102", "facility_id": "F100"},
        {"owner_id": "OWN-77", "owner_name": "Apex Syndicate Group LLC", "provider_id": "P103", "facility_id": "F100"},
        {"owner_id": "OWN-77", "owner_name": "Apex Syndicate Group LLC", "provider_id": "P105", "facility_id": "F100"},
        {"owner_id": "OWN-77", "owner_name": "Apex Syndicate Group LLC", "provider_id": "P106", "facility_id": "F100"},
        {"owner_id": "OWN-77", "owner_name": "Apex Syndicate Group LLC", "provider_id": "P090", "facility_id": "F090"},
        {"owner_id": "OWN-78", "owner_name": "Dr. Clara Evans Medical Corp", "provider_id": "P104", "facility_id": "F100"},
    ]
    owner_pool = [f"OWN-{i:03d}" for i in range(101, 800)]
    for i in range(8, 1151):
        oid = random.choice(owner_pool)
        oname = f"{fake.last_name()} Healthcare Holdings"
        pid = f"P{random.randint(1, 1200):03d}"
        fid = f"F{random.randint(1, 340):03d}"
        ownership_records.append({
            "owner_id": oid,
            "owner_name": oname,
            "provider_id": pid,
            "facility_id": fid
        })
    df_ownership = pd.DataFrame(ownership_records).drop_duplicates(subset=["owner_id", "provider_id"])

    # 4. Providers (1,200)
    providers = []
    # Planted Ring Providers
    ring_pids = [
        ("P101", "Internal Medicine", "12 MG Road", "OWN-77", "2025-12-12", None, "Metro Internal Medicine Assoc"),
        ("P102", "Physical Therapy", "12 MG Road", "OWN-77", "2024-05-10", None, "Metro Advanced Rehab & Physio"),
        ("P103", "Interventional Pain", "12 MG Road", "OWN-77", "2024-08-15", None, "Metro Comprehensive Pain Center"),
        ("P104", "Dermatology", "12 MG Road", "OWN-78", "2023-01-20", None, "Dr. Clara Evans Dermatology (Innocent Tenant)"),
        ("P105", "Diagnostic Imaging", "12 MG Road", "OWN-77", "2024-11-01", None, "Metro Diagnostic Imaging Suite"),
        ("P106", "Wellness & Infusion", "12 MG Road", "OWN-77", "2025-01-15", None, "Metro Wellness & IV Infusions"),
        # Phoenix predecessor
        ("P090", "Internal Medicine", "84 Old Harbor Way", "OWN-77", "2022-03-01", "2025-11-30", "Harborview Primary Care (Closed)"),
        # Decoys
        ("P201", "Family Practice", "400 Oak Street", "OWN-110", "2020-04-01", None, "Highland Family Health (High-Volume Decoy)"),
        ("P202", "Internal Medicine", "750 University Ave", "OWN-112", "2021-06-15", None, "University Geriatric Complex (High-Acuity Decoy)"),
        ("P203", "Podiatry", "102 Eastgate Blvd", "OWN-114", "2022-09-10", None, "Eastgate Podiatry (Weak Single-Signal Decoy)"),
        # Other Planted Fraud Scenarios
        ("P301", "DME Supplier", "55 Industrial Pkwy", "OWN-201", "2024-02-01", None, "Apex MedEquip Supplies"),
        ("P302", "Radiology", "88 Pinecrest Ave", "OWN-202", "2023-11-15", None, "Cascade Regional Imaging"),
        ("P303", "Pathology/Lab", "1200 Tech Center Dr", "OWN-203", "2024-01-10", None, "Biolab Precision Diagnostics"),
        ("P304", "Ambulance", "303 Express Way", "OWN-204", "2024-04-20", None, "RapidCare Emergency Transport"),
        ("P305", "Internal Medicine", "450 Medical Heights", "OWN-205", "2023-08-01", None, "Summit Valley Clinic"),
        ("P306", "Home Health", "620 Riverfront St", "OWN-206", "2024-03-12", None, "Horizon Elite Home Nursing"),
        ("P307", "Behavioral Health", "901 Horizon Way", "OWN-207", "2023-10-05", None, "Tranquil Mind Psychotherapy"),
        ("P308", "Pharmacy", "150 Main Street", "OWN-208", "2024-06-18", None, "CarePlus Specialty Rx"),
    ]

    planted_pid_set = {p[0] for p in ring_pids}
    for item in ring_pids:
        providers.append({
            "provider_id": item[0],
            "specialty": item[1],
            "address": item[2],
            "owner_id": item[3],
            "enrollment_date": item[4],
            "closure_date": item[5],
            "name": item[6],
            "city": "Metro City",
            "state": "IL"
        })

    # Fill remaining providers up to 1,200
    for i in range(len(ring_pids) + 1, 1201):
        pid = f"P{i:03d}"
        if pid in planted_pid_set:
            continue
        spec = random.choice(SPECIALTIES)
        addr = f"{random.randint(100, 9999)} {fake.street_name()}"
        oid = random.choice(owner_pool)
        enr_dt = (datetime(2021, 1, 1) + timedelta(days=random.randint(0, 1500))).strftime("%Y-%m-%d")
        providers.append({
            "provider_id": pid,
            "specialty": spec,
            "address": addr,
            "owner_id": oid,
            "enrollment_date": enr_dt,
            "closure_date": None,
            "name": f"Dr. {fake.name()} ({spec})",
            "city": fake.city(),
            "state": random.choice(["IL", "IN", "WI", "MI", "OH"])
        })
    df_providers = pd.DataFrame(providers).drop_duplicates(subset=["provider_id"])

    # 5. Referrals (6,400)
    referrals = []
    # Ring circular referral cycle: P101 -> P102 -> P103 -> P101, plus P105 & P106
    ring_members = [f"M{i:04d}" for i in range(501, 541)]  # 40 shared members M501-M540
    for m in ring_members:
        # Circular loops for these members
        for dt_offset in range(0, 180, 20):
            ref_dt = (datetime(2026, 1, 5) + timedelta(days=dt_offset)).strftime("%Y-%m-%d")
            referrals.append({"from_provider": "P101", "to_provider": "P102", "member_id": m, "date": ref_dt})
            referrals.append({"from_provider": "P102", "to_provider": "P103", "member_id": m, "date": ref_dt})
            referrals.append({"from_provider": "P103", "to_provider": "P101", "member_id": m, "date": ref_dt})
            referrals.append({"from_provider": "P101", "to_provider": "P105", "member_id": m, "date": ref_dt})
            referrals.append({"from_provider": "P101", "to_provider": "P106", "member_id": m, "date": ref_dt})

    # General background referrals
    all_pids = df_providers["provider_id"].tolist()
    all_mids = df_members["member_id"].tolist()
    while len(referrals) < 6400:
        p_from = random.choice(all_pids)
        p_to = random.choice(all_pids)
        if p_from != p_to:
            r_dt = (datetime(2025, 6, 1) + timedelta(days=random.randint(0, 360))).strftime("%Y-%m-%d")
            referrals.append({
                "from_provider": p_from,
                "to_provider": p_to,
                "member_id": random.choice(all_mids),
                "date": r_dt
            })
    df_referrals = pd.DataFrame(referrals[:6400])

    # 6. Prior Investigations (180 cases)
    investigations = []
    for i in range(1, 181):
        cid = f"CASE-{i:04d}"
        inv_pid = f"P{random.randint(500, 1200):03d}"
        outcome = random.choice(["SUBSTANTIATED", "DISMISSED", "SETTLED", "RECOVERED"])
        recov = round(random.uniform(15000, 280000), 2) if outcome in ["SUBSTANTIATED", "SETTLED", "RECOVERED"] else 0.0
        inv_dt = (datetime(2024, 1, 1) + timedelta(days=random.randint(0, 600))).strftime("%Y-%m-%d")
        investigations.append({
            "case_id": cid,
            "provider_id": inv_pid,
            "outcome": outcome,
            "recovered_amt": recov,
            "date": inv_dt
        })
    df_investigations = pd.DataFrame(investigations)

    # 7. Claims Generation (50,000)
    claims = []
    claim_id_counter = 100000

    def add_claim(mem, prov, fac, ref_prov, cpt, svc_date, s_time, e_time, units, billed, paid, diag="Z00.00", is_fraud=False, fraud_type=None):
        nonlocal claim_id_counter
        claim_id_counter += 1
        claims.append({
            "claim_id": f"CLM-{claim_id_counter}",
            "member_id": mem,
            "provider_id": prov,
            "facility_id": fac,
            "referring_provider_id": ref_prov,
            "service_type": CPT_DESCRIPTIONS.get(cpt, {}).get("type", "Professional"),
            "cpt_code": cpt,
            "diagnosis": diag,
            "service_date": svc_date,
            "start_time": s_time,
            "end_time": e_time,
            "units": units,
            "billed_amt": round(float(billed), 2),
            "paid_amt": round(float(paid), 2),
            "is_fraud": is_fraud,
            "fraud_type": fraud_type
        })

    # --- INJECT SCENARIO 1: BILLING RING & STEP CHANGE IN P101 ---
    # Closed predecessor P090 historical claims (prior to 2025-11-30)
    p090_members = ring_members[:28]  # 28 overlapping members
    for dt_off in range(0, 150, 7):
        s_dt = (datetime(2025, 6, 1) + timedelta(days=dt_off)).strftime("%Y-%m-%d")
        for m in p090_members:
            add_claim(m, "P090", "F090", "P090", "99214", s_dt, "09:00", "09:30", 1, 165.0, 140.0)

    # Ring members rotating through P101, P102, P103, P105, P106
    # Before 2026-02-16: P101 has normal level 3/4 mix (~10% level-5)
    for dt_off in range(0, 60, 4):
        s_dt = (datetime(2025, 12, 15) + timedelta(days=dt_off)).strftime("%Y-%m-%d")
        for m in ring_members:
            cpt = "99215" if random.random() < 0.10 else random.choice(["99213", "99214"])
            price = CPT_DESCRIPTIONS[cpt]["base_price"]
            add_claim(m, "P101", "F100", "P101", cpt, s_dt, "09:00", "09:40", 1, price, price * 0.85)
            # Allied ring services
            add_claim(m, "P102", "F100", "P101", "G0300", s_dt, "10:00", "11:00", 1, 210.0, 180.0, is_fraud=True, fraud_type="Ring Referral")
            add_claim(m, "P103", "F100", "P102", "99214", s_dt, "11:30", "12:00", 1, 165.0, 140.0, is_fraud=True, fraud_type="Ring Referral")

    # Post 2026-02-16: Step change for P101! ~92% Level-5 (99215)
    # Target ~600 post-change visits at P101
    post_dates = [datetime(2026, 2, 16) + timedelta(days=d) for d in range(0, 75, 2)]
    post_count = 0
    for p_dt in post_dates:
        s_dt = p_dt.strftime("%Y-%m-%d")
        for m in ring_members:
            if post_count >= 600:
                break
            cpt = "99215" if random.random() < 0.92 else "99214"
            add_claim(m, "P101", "F100", "P103", cpt, s_dt, "08:30", "09:10", 1, 240.0, 210.0, is_fraud=True, fraud_type="Upcoding Ring Step-Change")
            post_count += 1
            # Linked ring billing
            if random.random() < 0.7:
                add_claim(m, "P105", "F100", "P101", "73721", s_dt, "10:00", "10:45", 1, 520.0, 440.0, is_fraud=True, fraud_type="Ring Referral")
            if random.random() < 0.6:
                add_claim(m, "P106", "F100", "P101", "J0585", s_dt, "11:00", "11:15", 1, 310.0, 260.0, is_fraud=True, fraud_type="Ring Referral")

    # Impossible Timing spike on 2026-03-02 for P101: 38 Level-5 visits (38 * 40 min = 25.3 billed hours in 1 day!)
    spike_date = "2026-03-02"
    for idx, m in enumerate(ring_members[:38]):
        h = 8 + (idx % 10)
        m_start = (idx * 15) % 60
        add_claim(m, "P101", "F100", "P101", "99215", spike_date, f"{h:02d}:{m_start:02d}", f"{h+1:02d}:{m_start:02d}", 1, 240.0, 210.0, is_fraud=True, fraud_type="Impossible Timing Day (>24h)")

    # P104 (Innocent Tenant at 12 MG Road) claims
    p104_members = [f"M{random.randint(1000, 2000):04d}" for _ in range(30)]
    for d in range(0, 120, 5):
        s_dt = (datetime(2026, 1, 1) + timedelta(days=d)).strftime("%Y-%m-%d")
        for m in p104_members[:8]:
            add_claim(m, "P104", "F100", "P104", "99213", s_dt, "10:00", "10:20", 1, 110.0, 95.0, is_fraud=False)

    # --- INJECT SCENARIO 3: PHANTOM DME (P301) ---
    for i in range(1, 45):
        m = f"M{random.randint(2100, 2200):04d}"
        s_dt = (datetime(2026, 1, 10) + timedelta(days=i * 2)).strftime("%Y-%m-%d")
        add_claim(m, "P301", "F201", "P301", "E0601", s_dt, "10:00", "10:30", 1, 1250.0, 1100.0, diag="G47.33", is_fraud=True, fraud_type="Phantom DME Service")

    # --- INJECT SCENARIO 4: UNBUNDLING IMAGING (P302) ---
    for i in range(1, 55):
        m = f"M{random.randint(2201, 2300):04d}"
        s_dt = (datetime(2026, 2, 1) + timedelta(days=i)).strftime("%Y-%m-%d")
        # Split chest X-ray into two component codes instead of 71046
        add_claim(m, "P302", "F202", "P302", "71045", s_dt, "14:00", "14:15", 1, 85.0, 75.0, is_fraud=True, fraud_type="Unbundling")
        add_claim(m, "P302", "F202", "P302", "71045", s_dt, "14:15", "14:30", 1, 85.0, 75.0, is_fraud=True, fraud_type="Unbundling")

    # --- INJECT SCENARIO 5: DUPLICATE BILLING LAB (P303) ---
    for i in range(1, 50):
        m = f"M{random.randint(2301, 2400):04d}"
        s_dt = (datetime(2026, 1, 15) + timedelta(days=i * 2)).strftime("%Y-%m-%d")
        add_claim(m, "P303", "F203", "P303", "80053", s_dt, "08:00", "08:05", 1, 65.0, 55.0, is_fraud=False)
        add_claim(m, "P303", "F203", "P303", "80053", s_dt, "08:00", "08:05", 1, 65.0, 55.0, is_fraud=True, fraud_type="Duplicate Billing")

    # --- INJECT SCENARIO 6: IMPOSSIBLE TIMING AMBULANCE (P304) ---
    for i in range(1, 35):
        m1 = f"M{random.randint(2401, 2500):04d}"
        m2 = f"M{random.randint(2501, 2600):04d}"
        s_dt = (datetime(2026, 2, 5) + timedelta(days=i * 2)).strftime("%Y-%m-%d")
        # Overlapping 90-min transport trips on exact same vehicle timestamps
        add_claim(m1, "P304", "F204", "P304", "A0427", s_dt, "13:00", "14:30", 1, 890.0, 780.0, is_fraud=True, fraud_type="Impossible Timing Overlap")
        add_claim(m2, "P304", "F204", "P304", "A0427", s_dt, "13:15", "14:45", 1, 890.0, 780.0, is_fraud=True, fraud_type="Impossible Timing Overlap")

    # --- INJECT SCENARIO 7: EXCESSIVE UTILIZATION PHYSICIAN (P305) ---
    # Member M2700 receives 16 office visits in 30 days
    for d in range(1, 17):
        s_dt = (datetime(2026, 3, 1) + timedelta(days=d * 2)).strftime("%Y-%m-%d")
        add_claim("M2700", "P305", "F205", "P305", "99214", s_dt, "11:00", "11:30", 1, 165.0, 145.0, is_fraud=True, fraud_type="Excessive Utilization")

    # --- INJECT SCENARIO 8: UPCODING HOME HEALTH (P306) ---
    for i in range(1, 60):
        m = f"M{random.randint(2701, 2800):04d}"
        s_dt = (datetime(2026, 1, 20) + timedelta(days=i)).strftime("%Y-%m-%d")
        # 95% G0299/G0300
        cpt = "G0300" if random.random() < 0.95 else "99212"
        add_claim(m, "P306", "F206", "P306", cpt, s_dt, "09:00", "10:00", 1, 210.0, 185.0, is_fraud=True, fraud_type="Home Health Upcoding")

    # --- INJECT SCENARIO 9: EXCESSIVE PSYCHOTHERAPY (P307) ---
    for d in range(0, 50):
        m = f"M2901"
        s_dt = (datetime(2026, 1, 1) + timedelta(days=d)).strftime("%Y-%m-%d")
        add_claim(m, "P307", "F207", "P307", "90837", s_dt, "14:00", "15:00", 1, 210.0, 190.0, is_fraud=True, fraud_type="Excessive Daily Psychotherapy")

    # --- INJECT SCENARIO 10: PHARMACY DUPLICATE REFILLS (P308) ---
    for i in range(1, 40):
        m = f"M{random.randint(2902, 2980):04d}"
        s_dt1 = (datetime(2026, 2, 1) + timedelta(days=i * 2)).strftime("%Y-%m-%d")
        s_dt2 = (datetime(2026, 2, 1) + timedelta(days=i * 2 + 2)).strftime("%Y-%m-%d")
        add_claim(m, "P308", "F208", "P308", "NDC-9901", s_dt1, "09:00", "09:05", 1, 420.0, 380.0, is_fraud=False)
        add_claim(m, "P308", "F208", "P308", "NDC-9901", s_dt2, "09:00", "09:05", 1, 420.0, 380.0, is_fraud=True, fraud_type="Duplicate Pharmacy Refill")

    # --- INJECT DECOY 1: HIGH-VOLUME BUSY FAMILY CLINIC (P201) ---
    # Very high volume (1,200 claims), but normal code mix (balanced level 2, 3, 4, 5) and normal distribution
    for i in range(1200):
        m = f"M{random.randint(3000, 5000):04d}"
        s_dt = (datetime(2025, 6, 1) + timedelta(days=random.randint(0, 360))).strftime("%Y-%m-%d")
        cpt = np.random.choice(["99212", "99213", "99214", "99215"], p=[0.20, 0.45, 0.25, 0.10])
        price = CPT_DESCRIPTIONS[cpt]["base_price"]
        add_claim(m, "P201", "F209", "P201", cpt, s_dt, "09:00", "09:20", 1, price, price * 0.85, is_fraud=False)

    # --- INJECT DECOY 2: HIGH-ACUITY GERIATRIC CLINIC (P202) ---
    # High level 4/5 mix, but members have high patient risk_index (sicker patient mix explains intensity)
    high_risk_members = [f"M{random.randint(5001, 5500):04d}" for _ in range(80)]
    # Update df_members risk_index for these members
    df_members.loc[df_members["member_id"].isin(high_risk_members), "risk_index"] = 2.85
    for i in range(450):
        m = random.choice(high_risk_members)
        s_dt = (datetime(2025, 8, 1) + timedelta(days=random.randint(0, 300))).strftime("%Y-%m-%d")
        cpt = np.random.choice(["99214", "99215"], p=[0.40, 0.60])
        price = CPT_DESCRIPTIONS[cpt]["base_price"]
        add_claim(m, "P202", "F210", "P202", cpt, s_dt, "10:00", "10:40", 1, price, price * 0.85, is_fraud=False)

    # --- INJECT DECOY 3: EASTGATE PODIATRY (P203) - WEAK SINGLE SIGNAL SAFE-FAIL ---
    # Single isolated mild code variation, 0 graph links, 0 network loops, perfectly explained by normal bounds
    for i in range(50):
        m = f"M{random.randint(5501, 5600):04d}"
        s_dt = (datetime(2026, 1, 10) + timedelta(days=random.randint(0, 100))).strftime("%Y-%m-%d")
        add_claim(m, "P203", "F211", "P203", "99213", s_dt, "13:00", "13:20", 1, 110.0, 95.0, is_fraud=False)

    # Fill remaining claims up to 50,000 with realistic background distribution
    print(f"[*] Generated {len(claims)} targeted and planted claims. Filling background claims to reach 50,000...")
    cpt_keys = list(CPT_DESCRIPTIONS.keys())
    cpt_weights = [0.10, 0.15, 0.25, 0.15, 0.05, 0.08, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.005, 0.01, 0.01, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005]
    cpt_weights = [w / sum(cpt_weights) for w in cpt_weights]

    start_date = datetime(2025, 6, 1)
    while len(claims) < 50000:
        pid = f"P{random.randint(1, 1200):03d}"
        if pid in ["P101", "P102", "P103", "P105", "P106", "P090", "P301", "P302", "P303", "P304", "P305", "P306", "P307", "P308"]:
            # Keep planted provider ratios clean
            pid = f"P{random.randint(400, 1200):03d}"
        mid = f"M{random.randint(1, 8000):04d}"
        fid = f"F{random.randint(1, 340):03d}"
        cpt = np.random.choice(cpt_keys, p=cpt_weights)
        s_dt = (start_date + timedelta(days=random.randint(0, 364))).strftime("%Y-%m-%d")
        h = random.randint(8, 16)
        m_s = random.choice([0, 15, 30, 45])
        t_dur = CPT_DESCRIPTIONS[cpt]["time_min"]
        s_time = f"{h:02d}:{m_s:02d}"
        e_time = f"{h + (m_s + t_dur)//60:02d}:{(m_s + t_dur)%60:02d}"
        b_price = CPT_DESCRIPTIONS[cpt]["base_price"] * random.uniform(0.9, 1.15)
        p_price = b_price * random.uniform(0.75, 0.90)
        add_claim(mid, pid, fid, pid, cpt, s_dt, s_time, e_time, 1, b_price, p_price, is_fraud=False)

    df_claims = pd.DataFrame(claims[:50000])

    # 8. Save Ground Truth metadata
    ground_truth = {
        "planted_scenarios": [
            {
                "id": "SCENARIO-1",
                "title": "Coordinated Billing Ring & Step-Change Upcoding (P101-P106)",
                "providers": ["P101", "P102", "P103", "P105", "P106"],
                "excluded_tenant": "P104",
                "owner_id": "OWN-77",
                "address": "12 MG Road",
                "change_point_date": "2026-02-16",
                "spike_date": "2026-03-02",
                "evidence_strength": 1.0,
                "expected_category": "Coordinated Fraud Ring"
            },
            {
                "id": "SCENARIO-2",
                "title": "Phoenix Clinic Reincarnation (P090 -> P101)",
                "closed_provider": "P090",
                "new_provider": "P101",
                "owner_id": "OWN-77",
                "target_match_score": 0.88,
                "expected_category": "Phoenix Entity Resolution"
            },
            {
                "id": "SCENARIO-3",
                "title": "Phantom DME Equipment Services",
                "provider_id": "P301",
                "expected_category": "Phantom Services"
            },
            {
                "id": "SCENARIO-4",
                "title": "Unbundled Diagnostic Imaging Panels",
                "provider_id": "P302",
                "expected_category": "Unbundling"
            },
            {
                "id": "SCENARIO-5",
                "title": "Duplicate Clinical Laboratory Billing",
                "provider_id": "P303",
                "expected_category": "Duplicate Billing"
            },
            {
                "id": "SCENARIO-6",
                "title": "Impossible Timing Ambulance Overlaps",
                "provider_id": "P304",
                "expected_category": "Impossible Timing"
            },
            {
                "id": "SCENARIO-7",
                "title": "Excessive Physician Office Utilization",
                "provider_id": "P305",
                "expected_category": "Excessive Utilization"
            },
            {
                "id": "SCENARIO-8",
                "title": "Home Health Skilled Nursing Upcoding",
                "provider_id": "P306",
                "expected_category": "Upcoding"
            },
            {
                "id": "SCENARIO-9",
                "title": "Excessive Daily Intensive Psychotherapy",
                "provider_id": "P307",
                "expected_category": "Excessive Utilization"
            },
            {
                "id": "SCENARIO-10",
                "title": "Duplicate Controlled Pharmacy Refills",
                "provider_id": "P308",
                "expected_category": "Duplicate Fills"
            }
        ],
        "decoys": [
            {
                "id": "DECOY-1",
                "provider_id": "P201",
                "type": "High-Volume Legitimate Clinic",
                "expected_verdict": "Cleared / Normal Profile"
            },
            {
                "id": "DECOY-2",
                "provider_id": "P202",
                "type": "High-Acuity Geriatric Center",
                "expected_verdict": "Cleared by Sicker Patient Mix"
            },
            {
                "id": "DECOY-3",
                "provider_id": "P203",
                "type": "Eastgate Podiatry (Single Isolated Signal)",
                "expected_verdict": "INSUFFICIENT_EVIDENCE (Safe-Fail Triggered)"
            }
        ]
    }

    with open(GROUND_TRUTH_PATH, "w") as f:
        json.dump(ground_truth, f, indent=2)

    # 9. Store in DuckDB database
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    con = duckdb.connect(DB_PATH)
    con.execute("CREATE TABLE claims AS SELECT * FROM df_claims")
    con.execute("CREATE TABLE providers AS SELECT * FROM df_providers")
    con.execute("CREATE TABLE members AS SELECT * FROM df_members")
    con.execute("CREATE TABLE facilities AS SELECT * FROM df_facilities")
    con.execute("CREATE TABLE referrals AS SELECT * FROM df_referrals")
    con.execute("CREATE TABLE ownership AS SELECT * FROM df_ownership")
    con.execute("CREATE TABLE investigations AS SELECT * FROM df_investigations")
    con.close()

    print("[+] Successfully generated and loaded DuckDB database!")
    print(f"    - Claims: {len(df_claims):,}")
    print(f"    - Providers: {len(df_providers):,}")
    print(f"    - Members: {len(df_members):,}")
    print(f"    - Facilities: {len(df_facilities):,}")
    print(f"    - Referrals: {len(df_referrals):,}")
    print(f"    - Ownership: {len(df_ownership):,}")
    print(f"    - Investigations: {len(df_investigations):,}")
    print(f"    - DB Path: {DB_PATH}")


if __name__ == "__main__":
    generate_all()
