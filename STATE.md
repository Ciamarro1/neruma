# NERUMA — ESTADO ATUAL DO PROJETO (STATE.md)

> **Última Atualização:** 05 de Setembro de 2026  
> **Branch Ativa:** `main`  
> **Status Geral:** Monorepo estável, compilação estrita TypeScript 100% limpa, domínio comunitário gratuito configurado e em validação.

---

## 1. Visão Geral da Última Sessão

Nesta sessão, foi resolvida a obtenção de um domínio gratuito de alto nível para o projeto **Neruma**:
- **Domínio:** `neruma.eu.org`
- **Registrador:** [EU.org](https://nic.eu.org) (Iniciativa livre / Public Suffix List com controle total de DNS)
- **Gestão de DNS & SSL:** [Cloudflare](https://dash.cloudflare.com/) (Plano Free)
- **ID da Solicitação:** `20260905104556-arf-6901`
- **Handle Técnico/Admin:** `JAC106-FREE`
- **Servidores de Nomes Vinculados:**
  - `ANGELA.NS.CLOUDFLARE.COM`
  - `ZAC.NS.CLOUDFLARE.COM`
- **Status do Domínio:** Validação DNS aprovada sem erros (`No error, storing for validation...`). Aguardando processamento em lote da delegação pelos mantenedores do EU.org. A Cloudflare está monitorando ativamente em segundo plano.

---

## 2. Status dos Componentes do Monorepo

| Componente | Localização | Tecnologias Chave | Status |
|---|---|---|---|
| **Storefront** | `apps/storefront` | Next.js 15 App Router, React 19, Tailwind CSS, Three.js / R3F | ✅ Completo: PDP 3D (`luminaria-macrame-ninho.glb`), CartDrawer reativo, checkout em 3 etapas, todas as páginas institucionais e SEO dinâmico |
| **Commerce** | `apps/commerce` | Medusa v2 API, PostgreSQL, Mercado Pago, Melhor Envio, Valkey | ✅ Completo: Adapters de pagamento/frete, scripts de seed, subscribers de produto e detecção dinâmica de build do Admin |
| **Editorial CMS** | `apps/cms` | Payload CMS 3.0, PostgreSQL, S3/SeaweedFS, Drizzle ORM | ✅ Completo: Servidor HTTP standalone nativo (`server.ts`), Drizzle auto-push não-interativo para deploy, coleções modeladas |
| **AI Intelligence**| `services/ai-intel` | Python 3.11, FastAPI, Valkey Consumer, Gemini Prompts | ✅ Completo: Quality Gate anti-alucinação com testes de materiais/BOM passando, grava rascunhos em `_status: 'draft'` |
| **Tipagens Base** | `packages/types` | TypeScript estrito (`strict: true`) | ✅ Completo: Contratos canônicos centralizados para comércio, editorial, logística e IA |
| **Infraestrutura** | `infra/` | Traefik v3, Postgres, Valkey, Typesense, SeaweedFS | ✅ Completo: `docker-compose.prod.yml`, labels Traefik para SSL automático e script de healthcheck |

---

## 3. Backlog de Ações para a Próxima Sessão

- [ ] **1. Monitoramento do Domínio `neruma.eu.org`:**
  - Conferir caixa de e-mail associada ao handle `JAC106-FREE` e à Cloudflare.
  - Assim que chegar o e-mail *"Status change: neruma.eu.org is now active on Cloudflare"*, o domínio estará operacional.

- [ ] **2. Configuração de Apontamentos DNS na Cloudflare:**
  - Criar os seguintes registros assim que a zona for ativada:
    - `A` ou `CNAME` para `@` e `www` $\rightarrow$ Storefront Next.js
    - `CNAME` para `api` $\rightarrow$ Backend Medusa v2 (`api.neruma.eu.org`)
    - `CNAME` para `cms` $\rightarrow$ Backend Payload CMS (`cms.neruma.eu.org`)

- [ ] **3. Atualização das Variáveis de Ambiente de Produção:**
  - Ajustar o `.env` de produção com as URLs canônicas:
    ```env
    NEXT_PUBLIC_STORE_URL=https://neruma.eu.org
    NEXT_PUBLIC_MEDUSA_URL=https://api.neruma.eu.org
    NEXT_PUBLIC_PAYLOAD_URL=https://cms.neruma.eu.org
    ```

- [ ] **4. Ingestão Typesense:**
  - Executar script de sincronização inicial do catálogo Medusa v2 para a coleção de busca instantânea do Typesense.

- [ ] **5. Teste de Pagamento Pix / Webhook em Staging:**
  - Testar fluxo ponta a ponta gerando QR Code Pix de teste via adapter Mercado Pago com endpoint público.

---

## 4. Comandos Rápidos de Execução Local

```bash
# Rodar todos os workspaces simultaneamente (desenvolvimento):
pnpm dev

# Rodar apenas o Storefront (porta 3000):
cd apps/storefront && pnpm dev

# Testar compilação estrita de todo o monorepo:
pnpm build
```
