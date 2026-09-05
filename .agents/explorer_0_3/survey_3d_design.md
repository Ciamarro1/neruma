# Relatório de Análise: Ativos 3D, Design Tokens e Especificações Visuais Zenin

**Data**: 2026-09-05T01:06:00Z  
**Autor**: explorer_0_3 (Teamwork Explorer — 3D & Design Specialist)  
**Escopo**: `apps/storefront` — Modelo 3D, Tokens Tailwind, Especificações Zenin Sound Speaker e Arquitetura de Componentes  

---

## 1. Sumário Executivo

A nova Página de Detalhes do Produto (PDP) para a **Luminária Pendente Macramê Trama Ninho** (`luminaria-pendente-macrame-ninho`) foi concebida como uma experiência imersiva de luxo artesanal inspirada no conceito visual do **Zenin Sound Speaker** (Dribbble).

Nossa investigação aprofundada levantou métricas exatas do arquivo 3D `.glb`, da textura embutida, do comportamento geométrico do modelo, da estrutura de tokens Tailwind do monorepo Neruma e dos requisitos de interação touch/scroll.

### Principais Descobertas Críticas:
1. **Ativo 3D (`luminaria-macrame-ninho.glb`)**: Arquivo de 7,39 MB (7.749.172 bytes), contendo 50.000 polígonos triangulares (150.000 índices), 48.660 vértices e textura PNG de 2048×2048 px embutida (5,89 MB).
2. **Alerta Crítico de Iluminação (Normais Faltantes)**: O arquivo glTF possui apenas os atributos `POSITION` e `TEXCOORD_0`. Não há normais de vértice pré-calculadas (`NORMAL`). Para evitar sombreamento facetado ou problemas com luzes direcionais/pontuais, é **obrigatório invocar `geometry.computeVertexNormals()`** na inicialização do mesh no Three.js.
3. **Deslocamento do Centro (AABB)**: O centro geométrico original do modelo é `[-0.161, -0.124, -0.010]`. Se rotacionado diretamente na origem `(0, 0, 0)`, o modelo apresentará órbita excêntrica (bamboleio). O uso de `<Center>` do `@react-three/drei` (ou centralização da bounding box) corrige o pivô perfeitamente no eixo central.
4. **Design Tokens & Dark Hero**: O Tailwind já disponibiliza `neruma-dark` (`#1A1816`), `neruma-charcoal` (`#2B2824`), `neruma-bg` (`#FAF8F5`), além de escala de madeiras, areias e terracotas. A transição da seção Hero escura para o corpo claro editorial deve utilizar curvas orgânicas SVG e iluminação radial ambarina.
5. **Preservação da PDP Clássica**: Apenas produtos com modelo 3D associado (`luminaria-pendente-macrame-ninho`) devem carregar a experiência 3D Zenin; produtos sem 3D (`painel-macrame-aura-algodao`, `quadro-escultura-raizes-sisal`) permanecem com a renderização clássica funcional.

---

## 2. Inspeção Técnica Aprofundada do Ativo 3D

- **Caminho absoluto**: `apps/storefront/public/models/luminaria-macrame-ninho.glb`
- **Tamanho no disco**: `7.749.172 bytes` (~7,39 MB)
- **Formato**: glTF 2.0 Binary Container (`glTF` magic 0x46546C67)
- **Gerador de origem**: `https://github.com/mikedh/trimesh`

### Estrutura de Chunks e Nós
```text
GLB Header:
  Magic: glTF (0x46546C67)
  Version: 2
  Total Length: 7,749,172 bytes
  Chunk 0 (JSON): 1,396 bytes
  Chunk 1 (BIN):  7,747,756 bytes

Scene & Node Graph:
  Scenes: 1 (Scene 0 default)
  Nodes:
    ├── Node [0]: name="world", children=[1]
    └── Node [1]: name="temp_mesh.ply", mesh=0
```

### Métricas da Malha (Mesh) e Primitivas
- **Mesh count**: 1 (`temp_mesh.ply`)
- **Primitive count**: 1
- **Modo de renderização**: 4 (`TRIANGLES`)
- **Atributos de vértice presentes**:
  - `POSITION` (Accessor 1): 48.660 vértices, tipo `VEC3` (FLOAT)
  - `TEXCOORD_0` (Accessor 2): 48.660 coordenadas UV, tipo `VEC2` (FLOAT)
  - **`NORMAL`: AUSENTE** ⚠️ *(Ver seção de tratamento de normais abaixo)*
- **Índices de faces (Accessor 0)**: 150.000 índices (`UNSIGNED_INT`, 5125), correspondendo a **50.000 triângulos**.

### Material & Textura
- **Material 0**: PBR Metallic-Roughness
  - `roughnessFactor`: `0.903602` (alta rugosidade difusa, ideal para simular cordão de algodão cru e linho sem reflexos plásticos espelhados)
  - `baseColorFactor`: `[1, 1, 1, 1]`
  - `baseColorTexture`: Índice 0
- **Imagem embutida**:
  - BufferView 2: `6.174.548 bytes` (~5,89 MB, correspondente a ~80% do peso total do GLB)
  - Tipo MIME: `image/png`
  - Resolução da imagem: **2048 × 2048 pixels** (alta fidelidade nas tramas do macramê e fibras dos nós)

### Bounding Box (AABB) e Correção de Pivô
- **Mínimo**: `X = -0.6112, Y = -0.9861, Z = -0.4598`
- **Máximo**: `X =  0.2887, Y =  0.7377, Z =  0.4396`
- **Dimensões espaciais (X × Y × Z)**: `0.900m × 1.724m × 0.899m` (proporção esbelta vertical, 1 : 1.91 : 1)
- **Centro Geométrico**: `X = -0.1612, Y = -0.1242, Z = -0.0101`

> **Recomendação de Correção de Pivô**:  
> Como o centro geométrico está deslocado em `X = -0.161` e `Y = -0.124`, a malha precisa ser encapsulada em `<Center>` do `@react-three/drei` ou reposicionada com `geometry.center()`. Isso garante que ao girar o modelo em 360°, ele gire perfeitamente sobre seu eixo vertical de suspensão, sem oscilar para os lados.

### Tratamento Obrigatório das Normais de Vértice
Como o arquivo exportado pelo trimesh não gravou o buffer de normais, o Three.js em tempo de execução precisa calculá-las:
```typescript
// No carregamento do modelo (Three.js / R3F):
scene.traverse((child) => {
  if ((child as THREE.Mesh).isMesh) {
    const mesh = child as THREE.Mesh;
    if (!mesh.geometry.attributes.normal) {
      mesh.geometry.computeVertexNormals();
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
});
```
Isso garante iluminação suave e volumétrica sobre as cordas e franjas, sem polígonos facetados.

### Imagem Estática de Fallback (Placeholder LCP)
- **Arquivo**: `apps/storefront/public/images/products/luminaria-macrame-algodao.jpg`
- **Resolução**: 3024 × 4032 px (~958 KB)
- **Aspect Ratio**: 3:4 / 4:5
- **Uso**: Servir como fallback estático imediato no SSR com Next.js `next/image` (`priority`), mantendo o layout estável sem CLS enquanto o Three.js e o arquivo `.glb` são transferidos e compilados via WebGL.

---

## 3. Auditoria do Ecossistema de Design Tokens

O arquivo `apps/storefront/tailwind.config.ts` e a folha `apps/storefront/styles/globals.css` já contam com uma fundação de tokens orgânicos Neruma.

### Tabela de Tokens de Cores

| Token | Hex | Aplicação no Projeto |
|---|---|---|
| `neruma-bg` | `#FAF8F5` | Fundo orgânico claro padrão da marca (algodão cru / areia suave) |
| `neruma-dark` | `#1A1816` | Fundo principal da seção Hero escura (estilo Zenin) |
| `neruma-charcoal` | `#2B2824` | Fundo dos cartões e superfícies na seção escura |
| `neruma-muted` | `#736B63` | Textos secundários, legendas e rótulos auxiliares |
| `neruma-border` | `#E8E2D8` | Bordas sutis em superfícies claras |
| `neruma-sand-50` | `#FAF8F5` | Variação clara de areia |
| `neruma-sand-100` | `#F4EFE6` | Fundo de cartões specs na seção clara |
| `neruma-sand-200` | `#E8E0D2` | Badges, superfícies secundárias |
| `neruma-sand-300` | `#D8CDBC` | Linhas divisórias e detalhes |
| `neruma-sand-400` | `#C2B29D` | Ícones e destaques sutis |
| `neruma-wood` | `#6B5344` | Tom principal de madeira (freijó acolhedor) |
| `neruma-wood-light`| `#A68970` | Destaques quentes e halos de luz |
| `neruma-wood-dark` | `#4A3728` | Hover de botões escuros |
| `neruma-terracotta`| `#C46D47` | Acentos terrosos e selos especiais |
| `neruma-olive` | `#5A674D` | Selos de sustentabilidade e botânica |

### Tipografia
- `font-serif`: `Playfair Display`, serif — para títulos de alto padrão editorial, subtítulos nobres e nomes de produtos.
- `font-sans`: `Inter`, sans-serif — para corpo de texto, especificações técnicas, números e ações comerciais.

### Raios de Borda e Sombras
- `rounded-neruma`: `4px` (usado em botões, campos de formulário e detalhes estruturados).
- `rounded-organic`: `16px` (usado em cartões de especificações, cenas editoriais e popovers).
- `shadow-organic`: `0 10px 30px -10px rgba(43, 40, 36, 0.08)`.

### Extensões Recomendadas no Tailwind para a Seção Zenin
Para suportar com precisão os efeitos visuais do Zenin Sound Speaker, sugerimos estender `tailwind.config.ts` com:
1. **Keyframes de Animação**:
   - `fadeIn`: transição suave de opacidade (`0 -> 1`).
   - `slideUp`: transição combinada de elevação e opacidade (`translateY(24px) -> translateY(0)`).
   - `scaleIn`: entrada com sutil descompressão de escala (`scale(0.96) -> scale(1)`).
   - `pulseGlow`: pulso sutil simulando a oscilação luminosa interna da cúpula.
2. **Gradientes Radiais Utilitários**:
   - Halo de estúdio: `radial-gradient(circle at center, rgba(166, 137, 112, 0.15) 0%, rgba(26, 24, 22, 0) 70%)`.

---

## 4. Análise de Requisitos de Interação Zenin Sound Speaker

Inspirando-se no shot do Dribbble **Zenin Sound Speaker eCommerce**, a experiência da luminária Ninho deve equilibrar tecnologia 3D imersiva e estética biofílica acolhedora.

### 4.1. Hero Section 3D em Fundo Escuro (`neruma-dark` / `neruma-charcoal`)
- **Cenário**: Fundo profundo e aveludado (`#1A1816`) com um halo radial suave em tom freijó (`#A68970` a 12% de opacidade) centralizado atrás da luminária.
- **Iluminação 3D Studio**:
  - `AmbientLight`: 0.8 de intensidade em tom quente cremoso (`#FFF9F0`) para manter visíveis todas as dobras dos nós de macramê.
  - `DirectionalLight` (Key Light): intensidade 1.8, posicionado no quadrante superior frontal direito `[3, 5, 4]`, projetando sombras suaves que destacam o relevo das cordas trançadas.
  - `DirectionalLight` (Rim/Fill Light): intensidade 0.7 em tom âmbar suave `[-3, -1, -2]`, esculpindo o contorno traseiro da cúpula.
  - `PointLight` (Luz Interna da Cúpula): intensidade 1.2 posicionada no centro interno da cúpula `[0, 0.2, 0]`, simulando o acendimento da lâmpada E27 e difundindo luz através das frestas do macramê.
- **Overlays Flutuantes no Hero**:
  - Topo: Breadcrumb escuro minimalista (`text-neruma-sand-400 hover:text-neruma-bg`).
  - Badge editorial: `Lançamento | Coleção Raízes 2026` com borda sutil e fundo translúcido escuro (`bg-neruma-charcoal/80 backdrop-blur border border-white/10`).
  - Indicador de Interação: Pílula flutuante inferior com texto `"360° Interativo • Arraste para girar"` com micro-ícone de rotação e animação pulsante discreta.
  - Auto-rotação: Giro lento contínuo (`autoRotateSpeed = 0.8`), pausando suavemente assim que o usuário toca ou clica para manipular.

### 4.2. Transição Orgânica para Fundo Claro (`neruma-bg`)
- Em vez de um corte reto abrupto entre o preto e o creme, utilizar uma curva orgânica suave em SVG:
```html
<div class="relative -mt-1 w-full overflow-hidden leading-none z-10">
  <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" class="w-full h-16 sm:h-24 text-neruma-bg fill-current block">
    <path d="M0,0 C360,90 1080,90 1440,0 L1440,120 L0,120 Z" />
  </svg>
</div>
```
- A seção subsequente entra em `bg-neruma-bg`, criando uma respiração visual elegante: o escuro celebra a iluminação mágica da noite; o claro expõe os detalhes botânicos e as texturas da fibra natural à luz do dia.

### 4.3. Pelo Menos 3 Animações Ativadas por Scroll
1. **Animação 1 — Staggered Fade & Slide-Up (`slide-up`)**:
   - Títulos da narrativa editorial, parágrafos de conceito e bloco do artesão deslizam suavemente para cima (`24px -> 0px`) com opacidade progressiva à medida que cruzam 20% do viewport.
2. **Animação 2 — Scale & Focus Reveal (`scale-in`)**:
   - Os 4 cartões de especificações técnicas do Bento Grid entram com uma escala inicial de `95%` e expandem para `100%`, gerando sensação de presença física e solidez aos materiais.
3. **Animação 3 — Parallax Suave nos Destaques Visuais / Barra Flutuante**:
   - A barra flutuante de compra no rodapé surge com transição suave ao rolar além da Hero Section, acompanhada de micro-deslocamento das legendas flutuantes.

### 4.4. Cartões de Especificações Técnicas (Bento Grid)
Layout em grade responsiva (1 coluna no mobile, 2 no tablet, 4 no desktop) em `bg-neruma-sand-100/70 border border-neruma-border rounded-organic p-6`:
- **Card 1: Dimensões Reais**:
  - Valor: `280 × 500 × 280 mm` (28 × 50 × 28 cm)
  - Subtítulo: Diâmetro 28cm, altura de cúpula 50cm, cabo regulável até 1,50m.
  - Ícone: `Ruler` (régua técnica).
- **Card 2: Peso & Leveza**:
  - Valor: `850 g`
  - Subtítulo: Estrutura ultraleve em aço carbono fosco que não sobrecarrega a forração de gesso ou teto de madeira.
  - Ícone: `Sparkles` / `Feather`.
- **Card 3: Fibras & Materiais Nobres**:
  - Valor: `100% Fibras Naturais`
  - Subtítulo: Cordão de algodão cru torcido 3.5mm, aço carbono fosco cobreado e kit elétrico E27 revestido em linho puro.
  - Ícone: `Leaf` (sustentabilidade botânica).
- **Card 4: Manufatura & Autoria**:
  - Valor: `Ateliê Luz Orgânica Neruma`
  - Subtítulo: Produção 100% manual em Minas Gerais. Cerca de 7 horas de tecelagem ponto a ponto por peça.
  - Ícone: `Award` / `Hammer`.

### 4.5. Bloco Comercial Premium (Preço, Pix & Sacola)
- **Preço Principal**: `R$ 560,00` em destaque (formatado via `formatBRL(56000, true)`).
- **Desconto no Pix**: `R$ 532,00 à vista no Pix (5% de desconto automático)`.
- **Condição Parcelada**: `em até 10x de R$ 56,00 sem juros`.
- **Botão de Ação**: Botão largo de alta ergonomia `"Adicionar à Sacola"`.
- **Avisos de Confiança**:
  - Prazo de produção: 5 a 8 dias úteis sob encomenda.
  - Frete: cálculo em tempo real via Correios e Jadlog no checkout.
  - Garantia: 1 ano contra defeitos de fabricação.
  - Embalagem: 100% livre de plástico com papel colmeia de alta absorção.

### 4.6. Considerações Mobile & Gestos Touch
- **Prevenção de Conflito de Scroll**: Em telas sensíveis ao toque, se a tela inteira capturar o evento `touchmove`, o usuário não conseguirá rolar a página verticalmente ao tocar sobre a luminária.
  - Solução de Engenharia:
    1. Delimitar a área 3D com margens seguras para rolagem lateral ou vertical.
    2. Configurar o `OrbitControls` com `touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}` ou fornecer um botão de trava/destrava `"Explorar em 360°"`.
    3. `enablePan={false}` no mobile para evitar que o usuário desloque a luminária para fora da tela e perca o enquadramento.
- **Limites de Câmera e Zoom**:
  - `minDistance = 1.8`: impede que a câmera penetre no interior das cordas.
  - `maxDistance = 4.5`: impede que a luminária se torne um ponto minúsculo.
  - `minPolarAngle = Math.PI / 6` (30°): impede visão de topo ortogonal que quebra a silhueta da cúpula.
  - `maxPolarAngle = Math.PI / 1.75` (102°): impede visão subterrânea desconfortável.

---

## 5. Proposta de Hierarquia de Componentes

```text
apps/storefront/
├── app/(shop)/produto/[handle]/
│   └── page.tsx                         [Server Component - RSC]
│       ├── generateMetadata()           [SEO Dinâmico]
│       ├── ProductJsonLd                [Schema.org microdados]
│       ├── BreadcrumbJsonLd             [Navegação estruturada]
│       │
│       ├── [Condicional: tem 3D?]
│       │   ├── SE NÃO: <ClassicProductPage product={product} /> (Preserva catálogo existente)
│       │   └── SE SIM: <Immersive3DProductPage product={product} />
│       │
├── components/product/
│   ├── ProductHero3D.tsx                [Server Component com Container escuro]
│   │   ├── BreadcrumbDark               [Navegação contrastante sobre fundo escuro]
│   │   ├── ProductHeroHeader            [Título Playfair, Badges, Subtítulo]
│   │   ├── ProductViewer3DWrapper.tsx   [Client Component - Carregamento dinâmico]
│   │   │   ├── <ProductViewerPlaceholder /> [SSR/Fallback LCP - next/image com prioridade]
│   │   │   └── <ProductViewer3D />      [R3F Canvas dinâmico com ssr: false]
│   │   │       ├── <StudioLighting />   [Key light, Ambient, Fill, Inner light]
│   │   │       ├── <Center>             [Ajuste automático do pivô AABB]
│   │   │       │   └── <MacrameModel /> [Carregamento useGLTF + computeVertexNormals()]
│   │   │       ├── <OrbitControls />    [Limites de órbita, rotação suave e touch]
│   │   │       └── <ViewerBadge />      [Indicador 360° interativo]
│   │   └── ProductHeroActions.tsx       [Client Component: Preço, Pix e Botão Sacola]
│   │
│   ├── OrganicTransitionDivider.tsx     [SVG orgânico de transição dark -> light]
│   │
│   ├── ProductStorySection.tsx          [RSC: História, conceito botânico, artesão]
│   │
│   ├── ProductSpecsBento.tsx            [RSC/Client com IntersectionObserver]
│   │   ├── SpecCard (Dimensões 280x500x280mm)
│   │   ├── SpecCard (Peso 850g)
│   │   ├── SpecCard (Materiais Algodão/Aço/Linho)
│   │   └── SpecCard (Artesão Ateliê Luz Orgânica)
│   │
│   ├── ProductTrustBadges.tsx           [Garantia, Frete, Sustentabilidade]
│   └── ProductStickyBar.tsx             [Barra de compra fixa inferior para mobile]
```

---

## 6. Plano de Estilização e Integração

### Estratégia de Transição Visual (Dark para Light)
```tsx
// Exemplo de estrutura no componente da página
<div className="bg-neruma-dark text-neruma-bg">
  <ProductHero3D product={product} />
  
  {/* Divisor orgânico em curva para transição sem emenda */}
  <div className="relative -mt-1 w-full overflow-hidden leading-none">
    <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-12 sm:h-20 text-neruma-bg fill-current block">
      <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" />
    </svg>
  </div>
</div>

<div className="bg-neruma-bg text-neruma-dark">
  <ProductStorySection product={product} />
  <ProductSpecsBento product={product} />
  <ProductTrustBadges product={product} />
</div>
```

### Animações via Intersection Observer Leve
Para máxima performance sem inchar o bundle JavaScript com bibliotecas pesadas de animação:
```typescript
// Hook simples useInView ou utilitário com IntersectionObserver
// Aplica classes de transição CSS puras: opacity-100 translate-y-0 quando visível
```

---

## 7. Conclusão da Investigação

Todos os requisitos visuais, espaciais e técnicos para a PDP imersiva inspirada no Zenin Sound Speaker foram mapeados com precisão matemática:
- O arquivo `.glb` de 7,39 MB é de alta qualidade geométrica (50k polígonos) e textura 2k, mas requer **correção de normais de vértice** e **centralização de pivô**.
- Os design tokens do Tailwind cobrem integralmente as necessidades de contraste escuro/claro e identidade biofílica.
- A arquitetura Server Components com dynamic import garante LCP veloz e pontuações máximas de Core Web Vitals.
