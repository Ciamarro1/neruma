# Original User Request

## 2026-09-05T01:00:33Z

Criar uma **página de produto (PDP) 3D interativa e imersiva production-ready** para a Luminária Pendente Macramê Trama Ninho no storefront Next.js 15 da Neruma. Inspirada no estilo visual do [Zenin Sound Speaker eCommerce (Dribbble)](https://dribbble.com/shots/27122905-Zenin-Sound-Speaker-eCommerce), a PDP deve apresentar o modelo 3D rotacionável da luminária em macramê com animações de scroll, transições elegantes entre seções claras/escuras, e storytelling visual premium — tudo integrado ao monorepo existente e otimizado para produção.

Working directory: c:\Users\WDAGUtilityAccount\Documents\Nova pasta
Integrity mode: development

## Context & Existing Codebase

O projeto é um monorepo Neruma gerenciado com pnpm + Turborepo:

### Storefront (`apps/storefront`)
- **Stack**: Next.js 15.1.0, React 19, Tailwind CSS 3.4.10
- **PDP atual**: `apps/storefront/app/(shop)/produto/[handle]/page.tsx` — RSC com imagem estática única, breadcrumb, preço, botão "Adicionar à Sacola", specs e storytelling
- **Componentes**: `components/ui/` (Button, Badge, Container), `components/product/` (ProductCard), `components/editorial/` (LookbookScene)
- **Design Tokens Tailwind** em `apps/storefront/tailwind.config.ts`:
  - Fundo orgânico: `neruma-bg: #FAF8F5`
  - Dark: `neruma-dark: #1A1816`, `neruma-charcoal: #2B2824`
  - Madeira: `neruma-wood: #6B5344`
  - Areia: gradação 50-400
  - Terracotta, Olive com variantes light/dark
  - Tipografia: Playfair Display (serif) + Inter (sans)
  - Bordas: `rounded-neruma: 4px`, `rounded-organic: 16px`
- **Nenhuma lib 3D instalada atualmente**
- **Dados do produto** vêm do Medusa v2 via `@medusajs/js-sdk` usando `getProductByHandle(handle)`
- **Formatadores existentes**: `formatBRL()`, `formatDimensions()`, `formatWeight()` em `lib/utils/formatters`

### Modelo 3D
- **Arquivo**: `apps/storefront/public/models/luminaria-macrame-ninho.glb` (7.4 MB, já colocado no projeto)
- O modelo é uma luminária pendente em macramê com textura de cordas de algodão e estrutura metálica

### Dados do Produto (vindos do Medusa)
- **Handle**: `luminaria-pendente-macrame-ninho`
- **Título**: Luminária Pendente Macramê Trama Ninho
- **Subtítulo**: Cúpula artesanal em nós entrelaçados com difusão de luz acolhedora
- **Preço**: R$ 560,00 (56000 centavos)
- **SKU**: NER-LUM-NIN-MCR
- **Materiais**: corda algodão, aço carbono fosco, linho puro
- **Estilos**: japandi, orgânico, boho chic
- **Ambientes**: sala de jantar, quarto, varanda coberta
- **Dimensões**: 280×500×280mm (28×50×28cm)
- **Peso**: 850g
- **Artesão**: Ateliê Luz Orgânica Neruma (MG)
- **Badge**: Lançamento | Coleção Raízes 2026

### Convenções Obrigatórias
- TypeScript estrito (`strict: true`)
- Server Components por padrão; `'use client'` apenas nos componentes interativos folha
- Storefront é APENAS apresentação — sem lógica de negócio
- Moeda em centavos, formatada com `formatBRL()` na UI
- Gerenciador de pacotes: pnpm

## Requirements

### R1. Viewer 3D Interativo com React Three Fiber
Instalar `@react-three/fiber`, `@react-three/drei` e `three` no storefront e criar um componente client-side `ProductViewer3D` que carrega e renderiza o modelo `.glb` da luminária. O viewer deve suportar rotação orbital (drag/touch), zoom (scroll/pinch) com limites adequados, iluminação ambiente e direcional que destaquem a textura do macramê, e auto-rotação suave quando o usuário não está interagindo. O modelo deve estar centralizado e enquadrado automaticamente.

### R2. PDP Imersiva com Seções Dark/Light e Animações de Scroll
Redesenhar a página `apps/storefront/app/(shop)/produto/[handle]/page.tsx` para a luminária de macramê com layout inspirado no Zenin Sound Speaker, mantendo plena funcionalidade da PDP existente (SEO, breadcrumb, preço, botão de compra, specs). A página deve ter:
- **Hero section** com o viewer 3D ocupando destaque visual e fundo escuro (`neruma-dark`/`neruma-charcoal`)
- **Transições suaves** entre seções escuras e claras (fundo orgânico `neruma-bg`) para respeitar a identidade biofílica da marca
- **Animações ativadas por scroll** nos blocos de features/specs (fade-in, slide-up, parallax suave) — usando CSS animations, Intersection Observer nativo ou uma lib leve como `framer-motion`
- **Seção de specs/features** com layout premium mostrando dimensões, materiais, artesão e certificações com ícones e micro-animações
- **CTA premium** com botão "Adicionar à Sacola" destacado e informações de pagamento (parcelamento, Pix)
- **Totalmente responsivo**: experiência mobile-first com viewer 3D funcional em touch

### R3. Performance e SEO Production-Ready
A nova PDP deve manter os padrões de produção:
- **Lazy loading** do viewer 3D (carregar Three.js somente quando visível ou após hidratação; exibir a imagem estática como fallback/placeholder até o 3D carregar)
- **Preservar `generateMetadata`** e JSON-LD existentes para SEO
- **Core Web Vitals**: LCP < 2.5s (a imagem estática deve carregar primeiro, 3D carrega progressivamente), CLS < 0.1
- **Bundle splitting**: Three.js e R3F devem ser carregados via `next/dynamic` com `ssr: false`
- **Fallback gracioso**: se WebGL não for suportado, mostrar a imagem estática existente

### R4. Integração Limpa no Monorepo
Todas as mudanças devem seguir a arquitetura existente do monorepo:
- Instalar novas deps com `pnpm` em `apps/storefront`
- Criar componentes 3D em `apps/storefront/components/product/` (ex: `ProductViewer3D.tsx`, `ProductHeroSection.tsx`)
- Não quebrar a PDP genérica — a nova experiência 3D deve ser ativada apenas para produtos que possuem modelo 3D (verificar existência do arquivo .glb via metadata ou convenção de caminho), enquanto a PDP clássica continua funcionando para os demais produtos
- Respeitar e estender os design tokens existentes do Tailwind (adicionar tokens escuros se necessário)
- O código deve compilar sem erros com `pnpm typecheck` e `pnpm build` no workspace do storefront

## Acceptance Criteria

### 3D Viewer
- [ ] O modelo `luminaria-macrame-ninho.glb` carrega e renderiza corretamente no browser
- [ ] Rotação orbital funciona com mouse (drag) e touch (mobile)
- [ ] Zoom com scroll/pinch funciona e respeita limites min/max
- [ ] Auto-rotação suave está ativa quando o usuário não interage
- [ ] Iluminação adequada destaca a textura de macramê e as cordas do modelo

### Layout e Design
- [ ] Hero section com fundo escuro e viewer 3D ocupando destaque visual
- [ ] Pelo menos 2 seções com transição dark→light ou light→dark
- [ ] Pelo menos 3 animações de scroll distintas (fade-in, slide-up, scale ou similar)
- [ ] Layout responsivo: funciona em viewport 375px (mobile) e 1440px (desktop)
- [ ] Informações comerciais preservadas: preço formatado em BRL, botão "Adicionar à Sacola", specs técnicas, dados do artesão

### Performance e SEO
- [ ] Imagem estática aparece como placeholder enquanto o 3D carrega (sem tela em branco)
- [ ] Three.js é carregado via dynamic import (não incluso no bundle principal)
- [ ] `generateMetadata` e JSON-LD continuam funcionais
- [ ] Build completo sem erros: `pnpm build` no storefront passa sem falha

### Integração
- [ ] PDP clássica (sem 3D) continua funcionando para produtos que não possuem modelo 3D
- [ ] TypeScript compila sem erros: `pnpm typecheck` passa
- [ ] Novas dependências instaladas corretamente via pnpm no workspace storefront
- [ ] Nenhum componente ou utilidade existente é quebrado

## Verification

### Automated
```bash
# No diretório apps/storefront:
cd apps/storefront && pnpm typecheck    # TypeScript sem erros
cd apps/storefront && pnpm build        # Build Next.js sem erros
```

### Manual (Agent-as-Judge)
- Abrir `http://localhost:3000/produto/luminaria-pendente-macrame-ninho` no dev server
- Verificar que o modelo 3D carrega e é interativo
- Verificar responsividade redimensionando o viewport
- Verificar que a PDP de outros produtos (sem 3D) continua funcionando em `/produto/painel-macrame-aura-algodao`
