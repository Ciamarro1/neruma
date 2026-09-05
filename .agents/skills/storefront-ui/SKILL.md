---
name: storefront-ui
description: Padrões do Next.js 15 App Router e Design System Neruma (apps/storefront e packages/ui), incluindo busca Typesense, Server Components, LookbookScene e checkout.
---

# Storefront & UI Design Skill — Neruma

Esta habilidade orienta o desenvolvimento da interface e experiência do usuário no Next.js 15 (`apps/storefront`) e nos componentes compartilhados (`packages/ui`).

## 1. Responsabilidade
- Construir e manter a experiência visual no padrão editorial de luxo orgânico.
- Componentes chave:
  - `LookbookScene.tsx`: Hotspots interativos com renderização precisa de popover sobre imagens de alta resolução.
  - `ProductCard.tsx`: Exibição estratégica reutilizável em catálogo, carrosséis e histórias.
  - `checkout/page.tsx`: Checkout progressivo em 3 etapas (Identificação com validação de CPF, Seleção de Frete Melhor Envio e Pagamento Pix/Cartão Mercado Pago).
- Integração da busca instantânea Typesense facetada por material, ambiente e faixa de preço.

## 2. Comandos Frequentes
```bash
# Navegar até o storefront
cd apps/storefront

# Instalar dependências
pnpm install

# Iniciar servidor em desenvolvimento (porta 3000)
pnpm dev

# Executar verificação de tipos e build
pnpm build
```

## 3. Diretrizes de Desenvolvimento
- **Server Components Primeiro:** Utilize React Server Components (RSC) para carregar dados do Medusa e Payload na renderização inicial; isole a interatividade do cliente com `'use client'` estritamente nas folhas da árvore (ex: carrossel, popovers de hotspots, formulário de checkout).
- **Sem Lógica de Negócio Comercial:** O Storefront nunca calcula valores de desconto, taxas ou prazos por conta própria. Tudo deve ser obtido via API do Medusa.
- **Paleta Neruma (Tailwind):** Respeite as classes de cores orgânicas configuradas: tons de freijó, areia, terracota e verde oliva.
