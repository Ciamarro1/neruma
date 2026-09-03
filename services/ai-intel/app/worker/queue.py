import json
import redis.asyncio as redis
from typing import Optional
from app.config import settings
from app.domain.job import AIJob

class ValkeyJobQueue:
    def __init__(self):
        self.client = redis.from_url(settings.valkey_url, decode_responses=True)

    async def enqueue(self, job: AIJob) -> str:
        # Idempotência de 24 horas
        idempotency_key = f"neruma:ai:idempotency:{job.idempotency_key}"
        existing = await self.client.get(idempotency_key)
        if existing:
            print(f"[Queue] Job com idempotency_key {job.idempotency_key} já existe. Ignorando.")
            return job.id

        await self.client.set(idempotency_key, job.model_dump_json(), ex=86400)
        await self.client.lpush(settings.queue_main, job.model_dump_json())
        return job.id

    async def pop_job(self, timeout_seconds: int = 5) -> Optional[AIJob]:
        # Atomic BRPOPLPUSH: Move da fila principal para a fila de processamento
        raw_job = await self.client.brpoplpush(
            settings.queue_main,
            settings.queue_processing,
            timeout=timeout_seconds
        )
        if not raw_job:
            return None

        data = json.loads(raw_job)
        return AIJob.model_validate(data)

    async def mark_completed(self, job: AIJob):
        # Remove da fila de processamento
        await self.client.lrem(settings.queue_processing, 1, job.model_dump_json())
        print(f"[Queue] Job {job.id} concluído com sucesso e removido da fila de processamento.")

    async def handle_failure(self, job: AIJob, error_message: str):
        await self.client.lrem(settings.queue_processing, 1, job.model_dump_json())
        
        job.attempt += 1
        job.error = error_message

        if job.attempt < job.max_attempts:
            print(f"[Queue] Job {job.id} falhou (tentativa {job.attempt}/{job.max_attempts}). Reenfileirando...")
            await self.client.lpush(settings.queue_main, job.model_dump_json())
        else:
            print(f"[Queue] Job {job.id} excedeu o limite de tentativas. Movendo para DEAD-LETTER QUEUE.")
            job.status = 'dead_letter'
            await self.client.lpush(settings.queue_dead, job.model_dump_json())
