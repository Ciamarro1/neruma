from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal
from datetime import datetime

AIJobType = Literal[
    'product_enrichment',
    'product_seo',
    'product_alt_text',
    'product_pinterest',
    'product_social'
]

AIJobStatus = Literal[
    'queued',
    'processing',
    'completed',
    'failed',
    'dead_letter'
]

class AIJob(BaseModel):
    id: str
    type: AIJobType
    product_id: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    attempt: int = 0
    max_attempts: int = 3
    idempotency_key: str
    status: AIJobStatus = 'queued'
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = None
    error: Optional[str] = None
