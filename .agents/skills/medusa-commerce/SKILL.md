---
name: medusa-commerce
description: Procedimentos de desenvolvimento para o Medusa v2 no Neruma (apps/commerce), incluindo adapters de pagamento Mercado Pago, frete Melhor Envio, subscribers de catálogo e enfileiramento no Valkey.
---

# Medusa v2 Commerce Skill — Neruma

Esta habilidade orienta o desenvolvimento e manutenção do motor comercial do Neruma (`apps/commerce`).

## 1. Responsabilidade
- Gerenciar produtos, variantes, preços, inventário e checkout.
- Adaptadores de pagamento brasileiro: Pix e Cartão de Crédito via Mercado Pago (`src/modules/payment/mercadopago`).
- Adaptador de frete brasileiro: Correios e Jadlog via Melhor Envio (`src/modules/fulfillment/melhor-envio`).
- Publicar eventos de catálogo (`product.created`, `product.updated`) na fila Valkey com idempotência.

## 2. Comandos Frequentes
```bash
# Navegar até a aplicação
cd apps/commerce

# Instalar dependências
pnpm install

# Executar migrações
pnpm medusa db:migrate

# Executar seed de catálogo e região Brasil
pnpm seed:brazil

# Iniciar servidor em desenvolvimento (porta 9000)
pnpm dev
```

## 3. Padrões de Código
- **Idempotência de Fila:** Sempre use a chave `product_enrichment:<product_id>:v1` com expiração de 24h ao disparar jobs para o Valkey (`neruma:ai:queue`).
- **Validação de Preços:** Sempre armazene valores monetários como números inteiros em centavos (ex: R$ 490,00 = `49000`) com moeda `brl`.
- **Dimensões e Cubagem:** Salve dimensões em milímetros (`height`, `width`, `length`) e peso em gramas (`weight`) no Medusa. O adapter do Melhor Envio converterá para `cm` e `kg`.
