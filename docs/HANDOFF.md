# NERUMA — RELATÓRIO DE HANDOFF & TRANSFERÊNCIA DE CONTEXTO

> **Data:** 03 de Setembro de 2026  
> **Status do Projeto:** Fase de Fundação 100% Concluída (Arquitetura, Tipos, Commerce, CMS, Storefront, AI Intelligence e Infraestrutura).  
> **Local do Monorepo:** `e:\projcts\neruma`

---

## 1. Visão Geral & Filosofia do Projeto

A **Neruma** é uma operação comercial brasileira de e-commerce de alto padrão focada em decoração biofílica e design orgânico (quadros em freijó maciço, luminárias em fibras de sisal/algodão, peças em bambu e mobiliário pet minimalista).

### Pilares Fundamentais:
1. **Soberania Tecnológica (100% Self-Hosted Open Source no Core):** Todo o software sob controle da operação é open source com licenças limpas (MIT, Apache-2.0, BSD-3, PostgreSQL License).
2. **Serviços Externos Apenas Onde Inevitáveis:** Pagamento (Pix/Cartão via Mercado Pago/Asaas), Frete/Logística (Melhor Envio/Correios/Jadlog), CDN/WAF/DDoS (Cloudflare) e Backup Off-site (Cloudflare R2).
3. **Desacoplamento Rigoroso:**
   - **Medusa v2:** Única fonte de verdade comercial (preço, variantes, estoque, carrinho, checkout, frete, pagamentos).
   - **Payload CMS 3.0:** Cérebro editorial (coleções, lookbooks "Shop the Look", histórias de ateliê, guias de conservação de materiais).
   - **Next.js 15 App Router:** Camada de apresentação e experiência (SSR/ISR, sem regras de negócio embutidas).
   - **Neruma AI Worker:** Enriquecimento assíncrono via fila Valkey, com Quality Gate anti-alucinação e gravação com status `_status: draft` no Payload (Human-in-the-loop obrigatório).
   - **Typesense:** Motor de busca instantâneo e facetado em C++ (desafoga o PostgreSQL).

---

## 2. Mapa Estrutural do Monorepo

```text
e:\projcts\neruma/
├── package.json                       # Turborepo + pnpm workspaces
├── pnpm-workspace.yaml                # apps/*, services/*, packages/*
├── tsconfig.base.json                 # Configuração TS base estrita
├── .env.example                       # Matriz completa de variáveis e segredos isolados
├── README.md
│
├── packages/
│   └── types/                         # @neruma/types (Contratos de Domínio)
│       ├── src/
│       │   ├── product.ts             # Separado em Commercial, Design, Manufacturing (BOM) e Logistics
│       │   ├── shipping.ts            # Contratos de frete brasileiro (CEP, cubagem, transportadoras)
│       │   ├── payment.ts             # Contratos Pix, Cartão de Crédito, Boletos e Webhooks
│       │   ├── inventory.ts & pricing.ts # Regras de estoque e precificação artesanal
│       │   ├── order.ts & customer.ts # Pedidos, clientes e endereços no formato Brasil
│       │   ├── content.ts             # Schemas editoriais Payload CMS
│       │   ├── ai.ts                  # AIJob, AIJobStatus, QualityGateResult e Telemetria
│       │   └── index.ts
│       └── package.json
│
├── apps/
│   ├── commerce/                      # @neruma/commerce (Medusa v2 Engine)
│   │   ├── medusa-config.ts           # Configuração PostgreSQL + Valkey + Module Providers
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── payment/mercadopago/     # Adapter Mercado Pago (Pix QR Code/Copia e Cola, Cartão)
│   │   │   │   └── fulfillment/melhor-envio/# Adapter Melhor Envio (PAC, SEDEX, Jadlog .Com e Package)
│   │   │   ├── subscribers/
│   │   │   │   ├── product-created.ts       # Dispara job product_enrichment para a fila Valkey
│   │   │   │   └── product-updated.ts       # Dispara job product_seo para a fila Valkey
│   │   │   ├── lib/
│   │   │   │   └── queue.ts                 # Enfileirador Valkey com trava de idempotência de 24h
│   │   │   └── scripts/
│   │   │       └── seed-brazil.ts           # Seed Região Brasil, BRL, Categorias e Painel Freijó
│   │   └── tsconfig.json
│   │
│   ├── cms/                           # @neruma/cms (Payload CMS 3.0)
│   │   ├── src/
│   │   │   ├── payload.config.ts      # Configuração com Postgres, Lexical, S3 SeaweedFS e Auth
│   │   │   ├── collections/
│   │   │   │   ├── Collections.ts     # Coleções editoriais com vínculos Medusa
│   │   │   │   ├── Stories.ts         # Artigos da revista Neruma com tempo de leitura e produtos citados
│   │   │   │   ├── Lookbooks.ts       # Lookbooks com hotspots X/Y% para "Shop the Look"
│   │   │   │   ├── Rooms.ts           # Ambientes biofílicos e dicas espaciais
│   │   │   │   ├── Guides.ts          # Tutoriais de conservação de madeira e fibras
│   │   │   │   └── Media.ts           # Uploads S3 com tamanhos responsivos e Alt-Text obrigatório
│   │   │   └── globals/
│   │   │       ├── SiteSettings.ts    # Institucional, CNPJ, WhatsApp e Redes Sociais
│   │   │       ├── Navigation.ts      # Menus e barra de avisos de frete grátis
│   │   │       └── SEO.ts             # Metadados globais e JSON-LD
│   │   └── package.json
│   │
│   └── storefront/                    # @neruma/storefront (Next.js 15 App Router)
│       ├── app/
│       │   ├── layout.tsx             # Root layout com Header, Footer e SEO
│       │   ├── sitemap.ts             # Sitemap dinâmico unindo Medusa e Payload
│       │   ├── robots.ts              # Regras de indexação
│       │   ├── api/revalidate/route.ts# Webhook On-Demand ISR
│       │   ├── (shop)/
│       │   │   ├── page.tsx           # Home editorial completa
│       │   │   ├── produtos/page.tsx  # Catálogo geral
│       │   │   ├── produto/[handle]/page.tsx # PDP com preços Medusa, specs em mm e JSON-LD
│       │   │   ├── busca/page.tsx     # Busca Typesense facetada
│       │   │   ├── carrinho/page.tsx  # Sacola e estimador de frete
│       │   │   └── checkout/page.tsx  # Checkout progressivo em 3 etapas
│       │   └── (editorial)/
│       │       ├── lookbooks/         # Listagem e detalhe de lookbooks interativos
│       │       └── historias/         # Revista editorial e produtos citados
│       ├── components/
│       │   ├── product/ProductCard.tsx# Card estratégico reutilizado em toda a aplicação
│       │   ├── editorial/LookbookScene.tsx # Renderizador de hotspots interativos
│       │   ├── layout/                # Header, Footer
│       │   └── ui/                    # Button, Container, Badge
│       ├── lib/
│       │   ├── medusa/client.ts       # Medusa JS SDK v2 (@medusajs/js-sdk)
│       │   ├── payload/client.ts      # Cliente REST com tags de revalidação
│       │   ├── search/typesense.ts    # Cliente de busca Typesense
│       │   ├── seo/metadata.ts        # Helper OpenGraph e metadados
│       │   ├── seo/jsonld.tsx         # Schemas Schema.org
│       │   └── utils/formatters.ts    # BRL, dimensões em cm e CEP
│       └── tailwind.config.ts         # Paleta Neruma (madeira freijó, areia, terracota, oliva)
│
├── services/
│   └── ai-intel/                      # Neruma AI Product Intelligence Layer (Python)
│       ├── app/
│       │   ├── main.py                # FastAPI API Server
│       │   ├── config.py              # Configurações com Pydantic Settings
│       │   ├── api/                   # /health, /ready, /v1/products/{id}/enrich
│       │   ├── domain/                # ProductSnapshot, ProductEnrichment, QualityGateResult, AIJob
│       │   ├── providers/llm/         # Base Protocol e implementação Gemini Structured Output
│       │   ├── prompts/copywriting/v1.py # Prompt factual anti-alucinação
│       │   ├── pipelines/             # Orchestrator e Quality Gate
│       │   ├── integrations/          # Clientes Medusa (snapshot) e Payload (gravação de draft)
│       │   └── worker/                # Valkey Queue Manager e Consumer assíncrono
│       ├── tests/test_quality_gate.py # Testes de validação anti-alucinação
│       ├── Dockerfile                 # Multi-alvo (API ou Worker)
│       └── requirements.txt
│
└── infra/                             # Orquestração & Produção
    ├── docker-compose.prod.yml        # Compose oficial de produção (4 redes segregadas)
    ├── docker-compose.yml             # Compose de desenvolvimento local
    ├── docker/                        # Dockerfiles de produção (commerce, storefront, cms, ai)
    ├── postgres/init.sql              # Provisionamento multi-user/multi-db por menor privilégio
    ├── seaweedfs/s3.json              # Configuração do gateway S3 SeaweedFS
    ├── traefik/
    │   ├── traefik.yml                # Configuração estática ACME / Let's Encrypt
    │   └── dynamic.yml                # Middlewares HSTS, Rate Limiting, TLS e Basic Auth
    ├── backup/
    │   ├── backup-postgres.sh         # Dump atômico comprimido + SHA256 -> Cloudflare R2
    │   ├── backup-storage.sh          # Sincronização S3 SeaweedFS -> Cloudflare R2
    │   └── restore.sh                 # Validador de integridade e restauração
    └── scripts/
        ├── healthcheck.sh             # Diagnóstico de saúde dos 10 serviços
        └── init-multi-postgres.sh
```

---

## 3. Estado Atual dos Componentes & Arquitetura

| Componente | Função | Tecnologia | Licença | Status |
|---|---|---|---|---|
| **Traefik v3** | Reverse Proxy / TLS | Traefik Alpine | MIT | Configurado com ACME, HSTS e Rate Limit |
| **Medusa v2** | Commerce Engine | Node 20 / TypeScript | MIT (Core) | Configurado com BRL, Mercado Pago, Melhor Envio e Subscribers |
| **Payload CMS 3.0** | Editorial Brain | Next.js / TypeScript | MIT | 6 Coleções + 3 Globais + Postgres + S3 SeaweedFS |
| **Storefront** | Frontend de Vendas | Next.js 15 / Tailwind | MIT | SSR/ISR, Lookbooks interativos, PDP completa e Checkout |
| **AI Worker & API** | Enriquecimento & SEO | Python 3.11 / FastAPI | Próprio | Consumidor Valkey, Quality Gate e saída estruturada Gemini |
| **PostgreSQL 16** | Banco Relacional | PostgreSQL Alpine | Postgres License | 4 bancos isolados com usuários dedicados |
| **Valkey 7.2** | Cache / Filas / Locks | Valkey Alpine | BSD-3-Clause | Fila `neruma:ai:queue` com locking de 24h |
| **Typesense 27.1** | Busca Instantânea | Typesense C++ | GPL-3.0 (FOSS) | Cliente configurado com facetas no Storefront |
| **SeaweedFS** | Object Storage S3 | SeaweedFS Go | Apache-2.0 | S3 Gateway na porta 8333 para produtos e editorial |
| **Uptime Kuma** | Monitoramento | Node | MIT | Monitoramento de endpoints no compose |
| **Cloudflare R2** | Backup Off-Site | S3 API Cloudflare | SaaS Externo | Scripts automatizados com retenção 7d/4w/6m |

---

## 4. O Fluxo de Dados Ponta a Ponta ("Golden Path")

### A. Fluxo de Catálogo & Enriquecimento por IA (Human-in-the-loop):
1. Um produto é cadastrado no Medusa (manualmente ou via seed).
2. O subscriber `apps/commerce/src/subscribers/product-created.ts` intercepta o evento `product.created`.
3. O helper `apps/commerce/src/lib/queue.ts` calcula a chave de idempotência (`product_enrichment:prod_id:v1`) e insere o job na fila `neruma:ai:queue` no Valkey.
4. O processo consumidor `services/ai-intel/app/worker/consumer.py` puxa o job via `BRPOPLPUSH` atômico.
5. O `ProductIntelligenceOrchestrator`:
   - Busca o snapshot atualizado na API do Medusa.
   - Monta o prompt factual com diretrizes anti-alucinação.
   - Dispara chamada estruturada para o Gemini (ou fallback determinístico).
   - Executa o **Quality Gate**: verifica se materiais inventados foram introduzidos, valida tamanhos de SEO e calcula o *Confidence Score*.
   - Se aprovado pelo Gate, grava um rascunho na coleção `stories` do Payload CMS com `_status: 'draft'`, autor `Neruma AI Curator` e métricas de telemetria.
6. O curador humano revisa o texto no painel do Payload e clica em **Publicar**.

### B. Fluxo de Compra e Checkout:
1. O visitante navega pela Home ou pelos Lookbooks interativos no Next.js Storefront.
2. Ao clicar em um hotspot no Lookbook, o componente `LookbookScene` abre o popover com dados do produto e link direto para a PDP.
3. Na PDP (`/produto/[handle]`), o preço em BRL e as opções de frete são alimentados pelo Medusa Store API.
4. O cliente adiciona à sacola e avança para o Checkout progressivo em 3 etapas:
   - **Identificação:** Nome, e-mail, CPF (brasileiro).
   - **Frete:** Consulta de CEP via adapter `Melhor Envio` com cálculo de cubagem real (`mm` e `g` convertidos para `cm` e `kg`).
   - **Pagamento:** Pix com geração imediata de QR Code e chave Copia e Cola, ou Cartão de Crédito com parcelamento via adapter `Mercado Pago`.
5. O pedido é confirmado e o evento `order.created` é disparado.

---

## 5. Como Executar e Validar o Projeto

### Pré-requisitos:
- Docker e Docker Compose instalados.
- Node.js >= 20 e `pnpm` >= 9.
- Python >= 3.11.

### 1. Inicialização das Variáveis:
```bash
cd e:\projcts\neruma
cp .env.example .env
```

### 2. Subindo a Infraestrutura Core (Fase 1):
```bash
cd infra
docker compose -f docker-compose.prod.yml up -d postgres valkey typesense seaweedfs traefik uptime-kuma
```

### 3. Verificação de Saúde da Infraestrutura:
```bash
chmod +x infra/scripts/healthcheck.sh
./infra/scripts/healthcheck.sh
```

### 4. Execução dos Testes Unitários do AI Quality Gate:
```bash
cd services/ai-intel
pytest tests/
```

### 5. Seeding da Região Brasil no Medusa:
```bash
cd apps/commerce
pnpm install
pnpm seed:brazil
```

---

## 6. Próximos Passos Recomendados para a Próxima Sessão

1. **Sincronização Typesense:** Criar script ou listener para indexar os produtos do Medusa diretamente na coleção `products` do Typesense no momento do seed ou atualização.
2. **Integração de Webhooks do Mercado Pago:** Testar o recebimento de notificações de pagamento aprovado do Pix via URL pública do Traefik.
3. **Fase 2 de Observabilidade e Marketing (quando a operação escalar):**
   - Ativação do **listmonk** (Newsletter / Campanhas transacionais) conectado ao `listmonk_db`.
   - Ativação do **Matomo** para rastreamento de funil de vendas sem Google Analytics.
   - Ativação do **Chatwoot** para atendimento humanizado via WhatsApp.
   - Painéis no Grafana com métricas do Prometheus e logs centralizados via Loki.
