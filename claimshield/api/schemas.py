"""
ClaimShield Nexus: Pydantic v2 Schemas for Request/Response Validation.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class WeightUpdateSchema(BaseModel):
    w_risk: float = Field(0.30, ge=0.0, le=1.0)
    w_dollars: float = Field(0.20, ge=0.0, le=1.0)
    w_member: float = Field(0.15, ge=0.0, le=1.0)
    w_severity: float = Field(0.15, ge=0.0, le=1.0)
    w_evidence: float = Field(0.20, ge=0.0, le=1.0)


class DecisionSchema(BaseModel):
    decision: str = Field(..., description="approve_review, request_info, or dismiss")
    rationale: str = Field(..., description="Investigator rationale for audit record")
    investigator_name: Optional[str] = Field("SIU Senior Specialist", description="Name of investigator")


class PipelineStatusResponse(BaseModel):
    status: str
    claims_count: int
    raw_alerts_count: int
    ranked_cases_count: int
    rings_detected_count: int
    phoenix_links_count: int
    safe_fail_cases_count: int


class AuditEntryResponse(BaseModel):
    id: int
    timestamp: str
    user_name: str
    user_role: str
    action: str
    case_id: Optional[str]
    details: Dict[str, Any]
