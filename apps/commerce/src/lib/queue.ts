import Redis from 'ioredis';
import { AIJob, AIJobType } from '@neruma/types';

const redisUrl = process.env.REDIS_URL || 'redis://valkey:6379';
export const redisClient = new (Redis as any)(redisUrl);

export interface EnqueueJobInput {
  type: AIJobType;
  product_id: string;
  payload?: Record<string, unknown>;
  idempotency_key: string;
}

export async function enqueueAIJob(input: EnqueueJobInput): Promise<AIJob> {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const job: AIJob = {
    id: jobId,
    type: input.type,
    product_id: input.product_id,
    payload: input.payload || {},
    attempt: 0,
    max_attempts: 3,
    idempotency_key: input.idempotency_key,
    status: 'queued',
    created_at: new Date().toISOString(),
  };

  // Verifica chave de idempotência para evitar duplicações
  const exists = await redisClient.get(`neruma:ai:idempotency:${input.idempotency_key}`);
  if (exists) {
    console.log(`[Queue] Job com chave ${input.idempotency_key} já existe. Ignorando enfileiramento duplicado.`);
    return JSON.parse(exists);
  }

  // Registra idempotência com TTL de 24 horas
  await redisClient.set(
    `neruma:ai:idempotency:${input.idempotency_key}`,
    JSON.stringify(job),
    'EX',
    86400
  );

  // Adiciona na fila principal Valkey
  await redisClient.lpush('neruma:ai:queue', JSON.stringify(job));
  console.log(`[Queue] Job ${jobId} (${input.type}) enfileirado para o produto ${input.product_id}`);

  return job;
}
