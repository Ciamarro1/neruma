import Medusa from '@medusajs/js-sdk';

const medusaBackendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  'http://localhost:9000';

const publishableApiKey =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  'pk_test_neruma_storefront_2026';

export const medusa = new Medusa({
  baseUrl: medusaBackendUrl,
  publishableKey: publishableApiKey,
  debug: process.env.NODE_ENV === 'development',
});
