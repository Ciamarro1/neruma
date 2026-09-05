# NERUMA — RELATÓRIO CONSOLIDADO DE HANDOFF & TRANSFERÊNCIA DE CONTEXTO

> **Data:** 05 de Setembro de 2026  
> **Status Geral do Projeto:** Fase 1 (Fundação Monorepo) e Fase 2 (Storefront Biofílico 3D, Carrinho/Checkout, Deploy Standalone/Railway) 100% Concluídas.  
> **Integridade do Código:** TypeScript `strict: true` compilando sem erros em todos os workspaces; Monorepo pronto para deploy e desenvolvimento.

---

## 1. Visão Geral & Filosofia de Engenharia

A **Neruma** é uma plataforma e-commerce de alto padrão e revista editorial voltada ao design orgânico e decoração biofílica (luminárias em nós de macramê, painéis de sisal/algodão, peças em freijó e móveis artesanais).

### As 5 Regras de Ouro da Arquitetura:
1. **Medusa v2 (`apps/commerce`):** ÚNICA fonte de verdade comercial (preços, catálogo, estoque, frete Melhor Envio, pagamentos Mercado Pago / Pix).
2. **Payload CMS 3.0 (`apps/cms`):** ÚNICA fonte de verdade editorial (lookbooks "Shop the Look" com hotspots X/Y%, histórias, ambientes, guias).
3. **Storefront (`apps/storefront`):** Next.js 15 App Router + React 19 + Tailwind CSS — apenas camada de apresentação e experiência de compra. Sem persistência financeira direta ou regras de negócio críticas.
4. **Neruma AI Worker (`services/ai-intel`):** Fila assíncrona Valkey (`neruma:ai:queue`) com Quality Gate anti-alucinação rígido. Sempre grava rascunhos com `_status: 'draft'` no Payload (Human-in-the-Loop obrigatório).
5. **Contratos Canônicos em `@neruma/types`:** Toda tipagem compartilhada entre os serviços reside centralizada em `packages/types`.

---

## 2. Mapa Estrutural do Monorepo

```text
neruma/
├── package.json                       # Turborepo + pnpm workspaces (scripts unificados de start e build)
├── pnpm-workspace.yaml                # apps/*, services/*, packages/*
├── tsconfig.base.json                 # Configuração TS base estrita (strict: true)
├── .env.example                       # Matriz completa de variáveis de ambiente
├── turbo.json                         # Pipelines Turborepo com cache e filters por app
│
├── packages/
│   └── types/                         # @neruma/types (Contratos Canônicos TypeScript)
│       ├── product.ts                 # Commercial, Design, Manufacturing (BOM) e Logistics
│       ├── shipping.ts                # Frete brasileiro (CEP, cubagem em mm/g -> cm/kg)
│       ├── payment.ts                 # Pix QR Code, Copia e Cola, Cartão e Webhooks
│       ├── inventory.ts & pricing.ts  # Estoque e preços em centavos BRL
│       ├── order.ts & customer.ts     # Pedidos e clientes formato Brasil
│       ├── content.ts                 # Schemas editoriais Payload CMS
│       └── ai.ts                      # AIJob, QualityGateResult e Telemetria
│
├── apps/
│   ├── commerce/                      # @neruma/commerce (Medusa v2 API)
│   │   ├── medusa-config.ts           # Configuração PG, Valkey, detecção dinâmica de build do Admin
│   │   ├── src/
│   │   │   ├── modules/payment/mercadopago/     # Adapter Mercado Pago (Pix e Cartão)
│   │   │   ├── modules/fulfillment/melhor-envio/# Adapter Melhor Envio (PAC, SEDEX, Jadlog)
│   │   │   ├── subscribers/                     # Eventos de criação/atualização de produto -> fila Valkey
│   │   │   ├── lib/queue.ts                     # Enfileirador Valkey com lock de 24h
│   │   │   └── scripts/                         # seed-brazil, seed-3-products, create-api-key, publish-product
│   │   └── Dockerfile
│   │
│   ├── cms/                           # @neruma/cms (Payload CMS 3.0 Standalone REST Server)
│   │   ├── src/
│   │   │   ├── server.ts              # Servidor HTTP nativo Node.js com Drizzle Auto-push & REST API
│   │   │   ├── payload.config.ts      # Configuração Payload 3.0 com Postgres e S3 Storage
│   │   │   ├── collections/           # Collections, Stories, Lookbooks, Rooms, Guides, Media
│   │   │   └── globals/               # SiteSettings, Navigation, SEO
│   │   └── Dockerfile
│   │
│   └── storefront/                    # @neruma/storefront (Next.js 15 App Router + React 19)
│       ├── app/
│       │   ├── (shop)/
│       │   │   ├── page.tsx           # Home biofílica luxo (Hero editorial, curadoria, lookbooks)
│       │   │   ├── produto/[handle]/  # PDP dinâmica com detecção de modelo 3D GLB
│       │   │   ├── categorias/[handle]/# Listagem de categorias com filtros
│       │   │   ├── colecoes/          # Galeria de coleções editoriais
│       │   │   ├── busca/             # Busca instantânea Typesense com facetas
│       │   │   ├── carrinho/          # Sacola completa com cálculo de frete
│       │   │   ├── checkout/          # Checkout progressivo em 3 etapas com Pix e Cartão
│       │   │   └── sobre, contato, faq, envios, termos, privacidade (todas funcionais)
│       │   ├── (editorial)/
│       │   │   ├── lookbooks/         # Lookbooks interativos com hotspots
│       │   │   └── historias/         # Revista editorial Neruma
│       │   ├── api/checkout/send-confirmation/ # Disparo de e-mail de confirmação de pedido
│       │   ├── layout.tsx             # Root layout com CartProvider e CartDrawer global
│       │   └── sitemap.ts & robots.ts # SEO dinâmico com fallback resiliente
│       ├── components/
│       │   ├── product/ProductViewer3D.tsx     # Viewer 3D WebGL (Three.js / R3F) com OrbitControls
│       │   ├── product/ProductImmersivePDP.tsx # PDP Zenin Sound Style: Hero escuro, scroll reveal, specs
│       │   ├── cart/CartDrawer.tsx             # Gaveta de carrinho lateral com animação e feedback instantâneo
│       │   ├── editorial/LookbookScene.tsx     # Hotspots X/Y% interativos sobre imagens
│       │   └── ui/ScrollReveal.tsx             # Animações de viewport via Intersection Observer
│       ├── context/CartContext.tsx    # Estado global do carrinho com persistência em localStorage
│       ├── lib/email/order-email.ts   # Gerador de template HTML de e-mail de confirmação de compra
│       └── lib/medusa/mock-data.ts    # Catálogo fallback com luminária 3D e painéis artesanais
│
├── services/
│   └── ai-intel/                      # Neruma AI Product Intelligence Layer (Python 3.11 / FastAPI)
│       ├── app/
│       │   ├── main.py                # FastAPI API Server
│       │   ├── pipelines/             # Orchestrator e Quality Gate anti-alucinação
│       │   ├── worker/consumer.py     # Consumidor assíncrono Valkey (`neruma:ai:queue`)
│       │   └── prompts/copywriting/   # Prompts estruturados Gemini
│       └── tests/test_quality_gate.py # Testes de validação de fidelidade material
│
└── infra/                             # Orquestração Docker & Produção
    ├── docker-compose.prod.yml        # Compose oficial (Traefik v3, Postgres, Valkey, Typesense, SeaweedFS)
    ├── traefik/                       # Configurações TLS, Let's Encrypt e middlewares
    └── scripts/healthcheck.sh         # Diagnóstico automatizado dos 10 serviços
```

---

## 3. Principais Funcionalidades Implementadas Recentemente

### A. Experiência de Produto 3D & Tema Dark Biofílico (Zenin Sound Style)
- **Visualizador 3D Interativo (`ProductViewer3D`):**
  - Implementado com Three.js, `@react-three/fiber` e `@react-three/drei`.
  - Suporta órbita interativa (mouse drag e touch mobile), auto-rotação suave e iluminação ambiente/direcional calibrada para ressaltar texturas de fibras têxteis.
  - Carregamento assíncrono via `next/dynamic` (`ssr: false`) com fallback imediato para imagem estática (garantindo LCP < 2.5s).
  - Integrado ao modelo `luminaria-macrame-ninho.glb` (7.4 MB).
- **PDP Imersiva (`ProductImmersivePDP`):**
  - Seções com transições refinadas de contraste: Hero escuro (`neruma-dark`) para o visualizador 3D, contrastando com seções orgânicas e claras de storytelling e especificações técnicas.
  - Animações ativadas por scroll (`ScrollReveal`) para blocos de materiais, dimensões (em mm/cm) e ficha do artesão.
  - Seletor toggle entre visualização 3D e galeria estática em alta resolução.

### B. Ciclo Completo de Compra & Carrinho
- **Contexto de Carrinho (`CartContext` & `CartDrawer`):**
  - Gerenciamento reativo de itens com persistência em `localStorage`.
  - Notificação visual instantânea com abertura automática do `CartDrawer` ao clicar em "Adicionar à Sacola".
  - Contador dinâmico no ícone de sacola do Header em tempo real.
- **Checkout Progressivo e E-mails Transacionais:**
  - Fluxo de checkout em 3 etapas (Identificação, Frete com Melhor Envio, Pagamento com Pix/Cartão via Mercado Pago).
  - Módulo de e-mail transacional (`order-email.ts`) com template HTML estilizado na estética da marca e endpoint `/api/checkout/send-confirmation`.

### C. Navegação & Rotas 100% Cobertas
- Criação de todas as páginas institucionais e comerciais pendentes:
  - `/categorias/[handle]`: Listagem categorizada com breadcrumb e grid de produtos.
  - `/colecoes`: Showcase das coleções autorais.
  - `/sobre`, `/contato`, `/faq`, `/envios`, `/termos`, `/privacidade`: Todas estilizadas com design system e links funcionais no Header e Footer.

### D. Compatibilidade com Ambientes Cloud e Railway
- **Payload CMS Standalone:**
  - Criação do servidor HTTP nativo (`apps/cms/src/server.ts`) compilado diretamente para `dist/server.js`.
  - Implementação de Drizzle Auto-push com bypass de prompts interativos (`PAYLOAD_FORCE_DRIZZLE_PUSH=true` e `CI=true`) em ambientes sem terminal interativo.
- **Medusa v2 Resiliente:**
  - Detecção automática de build do Admin (`medusa-config.ts`), desabilitando o dashboard caso os assets compilados não estejam presentes para evitar crashes no boot.
  - Binding configurado para `0.0.0.0` para exposição pública em containers.
- **Storefront Resiliente:**
  - Normalização inteligente de URLs (`NEXT_PUBLIC_MEDUSA_URL`, `NEXT_PUBLIC_PAYLOAD_URL`) adicionando protocolo `https://` automaticamente se omitido.
  - `sitemap.ts` com fallback gracioso caso os backends estejam em fase de boot.

---

## 4. Estado da Qualidade & Build

| Workspace | Comando de Verificação | Status |
|---|---|---|
| `@neruma/storefront` | `pnpm --filter @neruma/storefront typecheck` | ✅ 0 erros |
| `@neruma/cms` | `pnpm --filter @neruma/cms build` | ✅ 0 erros (tsc) |
| `@neruma/commerce` | `pnpm --filter @neruma/commerce exec tsc --noEmit` | ✅ 0 erros |
| `services/ai-intel` | `pytest tests/` | ✅ Testes do Quality Gate passam |

---

## 5. Como Rodar o Projeto Localmente

### Opção A: Infraestrutura Docker (Completa)
```bash
# 1. Subir serviços de banco, cache, storage e busca:
cd infra
docker compose -f docker-compose.prod.yml up -d postgres valkey typesense seaweedfs traefik

# 2. Rodar todos os apps do monorepo em modo desenvolvimento:
cd ..
pnpm install
pnpm dev
```

### Opção B: Desenvolvimento Isolado do Storefront
```bash
cd apps/storefront
pnpm install
pnpm dev
# Acesse: http://localhost:3000
# Produto 3D: http://localhost:3000/produto/luminaria-pendente-macrame-ninho
```

### Opção C: Executando o CMS ou Commerce Isoladamente
```bash
# CMS:
cd apps/cms
pnpm build
pnpm start # Inicia REST API na porta 3001

# Commerce (Medusa v2):
cd apps/commerce
pnpm dev   # Inicia Medusa API na porta 9000
```

---

## 6. Próximos Passos Sugeridos

1. **Sincronização Typesense em Produção:**
   - Ativar o worker ou script de ingestão periódica que popula a coleção de busca do Typesense a partir dos produtos ativos do Medusa.
2. **Ambiente de Homologação / Staging:**
   - Subir instâncias conectadas no Railway ou servidor dedicado com Docker Compose.
   - Testar o webhook de retorno Pix do Mercado Pago com URL pública segura.
3. **Ampliação do Catálogo 3D:**
   - Adicionar novos modelos `.glb` em `apps/storefront/public/models/` para outras luminárias ou peças esculturais da marca, aproveitando a arquitetura modular existente.
