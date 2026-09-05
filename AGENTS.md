# NERUMA — DIRETRIZES ARQUITETURAIS & REGRAS PARA AGENTES (AGENTS.md)

Este documento define as regras absolutas de governança, arquitetura e convenções de código para qualquer agente de IA ou desenvolvedor atuando no monorepo **Neruma**.

---

## 1. Visão Geral & Filosofia de Engenharia

A **Neruma** é uma plataforma e-commerce de alto padrão e revista editorial voltada ao design orgânico e decoração biofílica.
O projeto adota uma filosofia de **Soberania Tecnológica**: 100% dos componentes essenciais de software são Open Source / Self-Hosted, com desacoplamento estrito entre comércio, conteúdo editorial, experiência de navegação e inteligência artificial.

---

## 2. As 5 Regras de Ouro da Arquitetura

1. **Medusa v2 (`apps/commerce`) é a ÚNICA fonte de verdade comercial:**
   - Preços, produtos comercializáveis, variantes, inventário, frete (Melhor Envio), pagamentos (Mercado Pago / Pix) e checkout pertencem unicamente ao Medusa.
   - NUNCA armazene transações financeiras, regras de desconto ou lógica de checkout no Payload CMS ou diretamente no Storefront.

2. **Payload CMS 3.0 (`apps/cms`) é a ÚNICA fonte de verdade editorial:**
   - Lookbooks ("Shop the Look" com hotspots X/Y%), Histórias/Revista (`Stories`), Ambientes (`Rooms`), Guias de Conservação (`Guides`) e Mídia pertencem exclusivamente ao Payload.
   - O Payload referencia produtos do Medusa através do identificador unificado `medusaProductId`.

3. **Storefront (`apps/storefront`) é APENAS camada de apresentação e experiência:**
   - Construído com Next.js 15 App Router e Server Components (RSC).
   - NUNCA implemente regras de negócio críticas, cálculos de imposto ou persistência direta de pedidos no Storefront.
   - Todo dado é consumido via SDKs (@medusajs/js-sdk, cliente REST do Payload e cliente Typesense).

4. **Neruma AI Worker (`services/ai-intel`) opera com Human-in-the-Loop Obrigatório:**
   - O pipeline de enriquecimento assíncrono consome jobs da fila Valkey (`neruma:ai:queue`) com locking de 24h.
   - **Regra Anti-alucinação:** A IA nunca inventa materiais, dimensões ou certificações não presentes no snapshot de manufatura do produto.
   - O resultado gerado é **SEMPRE** gravado no Payload CMS com status `_status: 'draft'`, aguardando aprovação explícita do curador humano antes de ir ao ar.

5. **Contratos Canônicos Centralizados em `packages/types`:**
   - Toda definição de tipo compartilhada (Produto, Pedido, Frete, Pagamento, Job de IA) reside em `@neruma/types`.
   - NUNCA duplique interfaces entre `apps/commerce`, `apps/storefront` e `apps/cms`.

---

## 3. Mapa de Responsabilidades do Monorepo

```text
neruma/
├── apps/
│   ├── commerce/       # @neruma/commerce (Medusa v2 API, Subscribers, Adapters)
│   ├── cms/            # @neruma/cms (Payload CMS 3.0, Coleções, Lexical, S3)
│   └── storefront/     # @neruma/storefront (Next.js 15 App Router, Tailwind, ISR)
├── services/
│   └── ai-intel/       # Product Intelligence Layer (FastAPI, Valkey Worker, Gemini)
├── packages/
│   ├── types/          # @neruma/types (Contratos TypeScript estritos de domínio)
│   └── ui/             # @neruma/ui (Design System Neruma, Tailwind compartilhado)
└── infra/              # Docker Compose (Traefik v3, Postgres, Valkey, Typesense, MinIO/SeaweedFS)
```

---

## 4. Convenções de Código & Comandos

### Gerenciamento de Pacotes & Build
- Gerenciador oficial: **`pnpm`** (versão `>= 9.0.0`).
- Orquestrador de monorepo: **`turborepo`** (`turbo`).
- Executar build completo: `pnpm build`
- Iniciar ambiente de desenvolvimento: `pnpm dev`
- Executar linter em todos os apps: `pnpm lint`
- Executar testes automatizados: `pnpm test`

### Padrões de Estilo & Qualidade
- **TypeScript:** Modo estrito (`strict: true`) herdado de `tsconfig.base.json`. Não use `any` a menos que estritamente justificado.
- **Unidades:**
  - Moeda: Centavos inteiros em BRL nos schemas de dados; formatado como `R$ 0,00` apenas na UI.
  - Dimensões: Milímetros (`mm`) no backend/BOM; convertidos para `cm` na exibição e cálculo de cubagem.
  - Peso: Gramas (`g`) no backend/BOM; convertidos para `kg` para transportadoras.
- **Logs:** Use logging estruturado em JSON ou prefixos legíveis. NUNCA exponha credenciais, chaves de API ou dados de cartão/CPF nos logs.

---

## 5. Kit de Papéis de Subagentes Especializados

Ao interagir no monorepo ou dividir tarefas via subagentes, respeite estes 5 papéis:

1. **`commerce-agent`**: Especialista em Medusa v2, PostgreSQL, eventos e plugins de pagamento/frete.
2. **`editorial-agent`**: Especialista em Payload CMS 3.0, modelagem Lexical, coleções e uploads S3.
3. **`storefront-agent`**: Especialista em Next.js 15 App Router, UI biofílica, Tailwind e Typesense.
4. **`ai-intelligence-agent`**: Especialista em Python 3.11, FastAPI, Valkey, prompts Gemini e Quality Gates.
5. **`infra-devops-agent`**: Especialista em Docker Compose, Traefik v3, healthchecks e backups atômicos.
