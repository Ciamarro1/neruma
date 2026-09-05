import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { enqueueAIJob } from '../lib/queue';

export default async function productUpdatedHandler({
  event,
}: SubscriberArgs<{ id: string }>) {
  const productId = event.data.id;
  if (!productId) return;

  console.log(`[Medusa Subscriber] Evento product.updated recebido para o ID: ${productId}`);

  // Dispara apenas reavaliação de SEO e Alt-text para evitar regeneração desnecessária
  await enqueueAIJob({
    type: 'product_seo',
    product_id: productId,
    idempotency_key: `product_seo:${productId}:${Date.now()}`,
  });
}

export const config: SubscriberConfig = {
  event: 'product.updated',
};
