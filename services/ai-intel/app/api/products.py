from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid
from app.domain.job import AIJob
from app.worker.queue import ValkeyJobQueue
from app.pipelines.orchestrator import ProductIntelligenceOrchestrator

router = APIRouter(prefix="/v1/products", tags=["Products AI"])
queue = ValkeyJobQueue()
orchestrator = ProductIntelligenceOrchestrator()

class ManualTriggerResponse(BaseModel):
    job_id: str
    product_id: str
    status: str
    idempotency_key: str

@router.post("/{product_id}/enrich", response_model=ManualTriggerResponse)
async def trigger_product_enrichment(product_id: str, sync: bool = False):
    job_id = f"ai_job_{uuid.uuid4().hex[:8]}"
    idempotency_key = f"product_enrichment:{product_id}:{uuid.uuid4().hex[:6]}"

    job = AIJob(
        id=job_id,
        type='product_enrichment',
        product_id=product_id,
        idempotency_key=idempotency_key,
        status='queued'
    )

    if sync:
        # Execução síncrona direta para testes imediatos
        result = await orchestrator.process_job(job)
        return ManualTriggerResponse(
            job_id=job_id,
            product_id=product_id,
            status="completed_sync",
            idempotency_key=idempotency_key
        )

    # Enfileiramento assíncrono padrão via Valkey
    await queue.enqueue(job)

    return ManualTriggerResponse(
        job_id=job_id,
        product_id=product_id,
        status="queued",
        idempotency_key=idempotency_key
    )

@router.post("/{product_id}/seo", response_model=ManualTriggerResponse)
async def trigger_product_seo(product_id: str):
    job_id = f"ai_job_{uuid.uuid4().hex[:8]}"
    idempotency_key = f"product_seo:{product_id}:{uuid.uuid4().hex[:6]}"

    job = AIJob(
        id=job_id,
        type='product_seo',
        product_id=product_id,
        idempotency_key=idempotency_key,
        status='queued'
    )

    await queue.enqueue(job)

    return ManualTriggerResponse(
        job_id=job_id,
        product_id=product_id,
        status="queued",
        idempotency_key=idempotency_key
    )
