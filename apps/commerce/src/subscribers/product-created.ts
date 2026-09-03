import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { enqueueAIJob } from '../lib/queue.js';

export default async function productCreatedHandler({
  event,
}: SubscriberArgs<{ id: string }>) {
  const productId = event.data.id;
  if (!productId) return;

  console.log(`[Medusa Subscriber] Evento product.created recebido para o ID: ${productId}`);

  await enqueueAIJob({
    type: 'product_enrichment',
    product_id: productId,
    idempotency_key: `product_enrichment:${productId}:v1`,
  });
}

export const config: SubscriberConfig = {
  event: 'product.created',
};
