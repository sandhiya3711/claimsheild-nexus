"""
ClaimShield Nexus: Append-Only SQLite Audit Trail.
Guarantees complete traceability and accountability for all algorithmic outputs
and human investigator decisions.
"""

import json
import os
import sqlite3
from datetime import datetime
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
AUDIT_DB_PATH = os.path.join(DATA_DIR, "audit_log.db")


def init_audit_db():
    conn = sqlite3.connect(AUDIT_DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS audit_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            user_name TEXT NOT NULL,
            user_role TEXT NOT NULL,
            action TEXT NOT NULL,
            case_id TEXT,
            details_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def log_audit_event(
    user_name: str,
    user_role: str,
    action: str,
    case_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> int:
    init_audit_db()
    conn = sqlite3.connect(AUDIT_DB_PATH)
    cur = conn.cursor()
    ts = datetime.utcnow().isoformat() + "Z"
    details_str = json.dumps(details or {})

    cur.execute(
        "INSERT INTO audit_events (timestamp, user_name, user_role, action, case_id, details_json) VALUES (?, ?, ?, ?, ?, ?)",
        (ts, user_name, user_role, action, case_id, details_str)
    )
    event_id = cur.lastrowid
    conn.commit()
    conn.close()
    return event_id


def get_audit_trail(limit: int = 100) -> List[Dict[str, Any]]:
    init_audit_db()
    conn = sqlite3.connect(AUDIT_DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM audit_events ORDER BY id DESC LIMIT ?", (limit,))
    rows = cur.fetchall()
    conn.close()

    events = []
    for r in rows:
        events.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "user_name": r["user_name"],
            "user_role": r["user_role"],
            "action": r["action"],
            "case_id": r["case_id"],
            "details": json.loads(r["details_json"])
        })
    return events


if __name__ == "__main__":
    init_audit_db()
    log_audit_event("System", "PIPELINE", "INITIALIZE_AUDIT_LOG", None, {"status": "SUCCESS"})
    print("Audit log initialized. Total entries:", len(get_audit_trail()))
