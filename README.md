# Neruma — E-commerce & Plataforma de Design Orgânico

Arquitetura 100% sob seu controle (Open Source / Self-Hosted), com storefront editorial de alto padrão, motor de comércio Medusa v2, Payload CMS 3.0, PostgreSQL, Valkey e Inteligência de Catálogo/Marketing.

---

## 🏗️ Estrutura do Monorepo

```text
neruma/
├── apps/
│   ├── storefront/              # Next.js 14/15 App Router (Catálogo, Checkout, Editorial)
│   ├── commerce/                # Medusa v2 Backend (Catálogo, Pedidos, Frete, Pagamentos)
│   └── cms/                     # Payload CMS 3.0 (Blog, Guias, Coleções, Editorial)
├── services/
│   └── ai-intel/                # Product Intelligence Layer (SEO, Pinterest, Descrições IA)
├── packages/
│   ├── ui/                      # Design System Neruma (Tailwind, componentes compartilhados)
│   └── types/                   # Tipos TypeScript compartilhados
├── infra/
│   ├── docker-compose.yml       # Stack Core (Traefik, Postgres, Valkey, Typesense, MinIO, Apps)
│   ├── traefik/                 # Configuração do Proxy Reverso e TLS
│   └── scripts/                 # Scripts de inicialização de bancos e backups
└── .env.example                 # Modelo de variáveis de ambiente
```

---

## 🚀 Como Iniciar em Desenvolvimento

1. **Copie as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

2. **Suba os serviços de infraestrutura básica:**
   ```bash
   cd infra
   docker compose up -d postgres valkey typesense minio traefik uptime-kuma
   ```

3. **Acesse os serviços:**
   - Traefik Dashboard: `http://localhost:8080`
   - MinIO Console: `http://localhost:9001` (login configurado no `.env`)
   - Typesense: `http://localhost:8108`

---

## 📦 BOM da Infraestrutura & Especificação Completa

Para visualizar a matriz completa de dependências, requisitos de hardware (VPS 8GB vs 16GB), licenças e custos, consulte a documentação detalhada em `infrastructure_bom.md`.
