import { defineConfig, Modules } from '@medusajs/framework/utils';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || 'postgresql://medusa_user:medusa_db_secret_password_2026@postgres:5432/medusa_db',
    redisUrl: process.env.REDIS_URL || 'redis://valkey:6379',
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000,https://neruma.com.br,https://shop.neruma.com.br',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000,https://admin.neruma.com.br',
      authCors: process.env.AUTH_CORS || 'http://localhost:3000,http://localhost:9000',
      jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_neruma_at_least_32_characters',
      cookieSecret: process.env.COOKIE_SECRET || 'super_secret_cookie_key_neruma_at_least_32_chars',
    },
  },
  modules: [
    // 1. Payment Module com Provedor Próprio Mercado Pago (PIX + Cartão)
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: './src/modules/payment/mercadopago',
            id: 'mercadopago',
            options: {
              accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
              publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
            },
          },
        ],
      },
    },
    // 2. Fulfillment Module com Provedor Próprio Melhor Envio (PAC/SEDEX/Jadlog)
    {
      resolve: '@medusajs/medusa/fulfillment',
      options: {
        providers: [
          {
            resolve: './src/modules/fulfillment/melhor-envio',
            id: 'melhor-envio',
            options: {
              apiToken: process.env.MELHOR_ENVIO_TOKEN,
              sandbox: process.env.MELHOR_ENVIO_SANDBOX === 'true',
              originPostalCode: process.env.ORIGIN_POSTAL_CODE || '01310100', // Hub Neruma SP
            },
          },
        ],
      },
    },
  ],
});
