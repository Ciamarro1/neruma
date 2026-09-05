# Handoff Report — Explorer 0_3: 3D Assets, Design Tokens & Zenin Visual Specs

**Agent**: `explorer_0_3`  
**Recipient**: `parent` (Orchestrator conversation ID: `0c9f9390-57d9-4389-afcb-49c58827302a`)  
**Type**: Hard Handoff (Task Complete)  
**Date**: 2026-09-05T01:07:30Z  

---

## 1. Observation

1. **Arquivo 3D GLB**:
   - Caminho: `apps/storefront/public/models/luminaria-macrame-ninho.glb`
   - Tamanho verificado: `7.749.172 bytes` (~7,39 MB).
   - Saída da inspeção direta (`inspect_glb.js`):
     ```text
     Magic: glTF | Version: 2 | Length in bytes: 7749172 (7.39 MB) | Generator: https://github.com/mikedh/trimesh
     Node [0]: name="world", children=[1]
     Node [1]: name="temp_mesh.ply", mesh=0
     Mesh [0]: name="temp_mesh.ply", primitives=1, mode=4
     Attributes: ["POSITION","TEXCOORD_0"]
     Accessors:
       Indices (Accessor 0): count = 150000 (50,000 triângulos), componentType = 5125 (UNSIGNED_INT)
       Position (Accessor 1): count = 48660 (VEC3)
       TexCoord (Accessor 2): count = 48660 (VEC2)
     Material [0]: pbrMetallicRoughness = {"baseColorTexture":{"index":0},"baseColorFactor":[1,1,1,1],"roughnessFactor":0.9036020036098448}
     Image [0]: mimeType = "image/png", bufferView = 2, size = 6174548 bytes (5.89 MB), dimensions = 2048 x 2048
     AABB Bounding Box:
       Min: [-0.6112348437309265, -0.9860804677009583, -0.4598095417022705]
       Max: [0.28866884112358093, 0.7377463579177856, 0.4396168887615204]
       Size (X, Y, Z): [ '0.900', '1.724', '0.899' ]
       Center (X, Y, Z): [ '-0.161', '-0.124', '-0.010' ]
     ```
   - **Normais de Vértice**: Ausentes no buffer glTF (`attributes: ["POSITION", "TEXCOORD_0"]`).

2. **Imagem Estática de Fallback (Placeholder LCP)**:
   - Caminho: `apps/storefront/public/images/products/luminaria-macrame-algodao.jpg`
   - Tamanho: `981.213 bytes` (~958 KB).
   - Dimensões: `3024 × 4032 px` (aspect ratio 3:4 / 4:5).

3. **Design Tokens no Tailwind (`apps/storefront/tailwind.config.ts`)**:
   - `neruma.bg`: `'#FAF8F5'`
   - `neruma.dark`: `'#1A1816'`
   - `neruma.charcoal`: `'#2B2824'`
   - `neruma.wood`: `{ light: '#A68970', DEFAULT: '#6B5344', dark: '#4A3728', freijo: '#7A5C3E' }`
   - `neruma.terracotta`: `{ light: '#DE9674', DEFAULT: '#C46D47', dark: '#9E4E2C' }`
   - `neruma.olive`: `{ light: '#828E75', DEFAULT: '#5A674D', dark: '#3F4A34' }`
   - Fontes: `serif: ['var(--font-serif)', 'Playfair Display', 'serif']`, `sans: ['var(--font-sans)', 'Inter', 'sans-serif']`.
   - Raios: `rounded-neruma: '4px'`, `rounded-organic: '16px'`.
   - Sombras: `shadow-organic`, `shadow-card`.

4. **Folha Global de Estilos (`apps/storefront/styles/globals.css`)**:
   - Variáveis CSS `--font-serif` e `--font-sans` configuradas na raiz `:root`.
   - `body` possui `bg-[#FAF8F5]` e `color-[#1A1816]`.

5. **Dados Comerciais no Backend (`apps/commerce/src/scripts/seed-3-products.ts:131-180`)**:
   - Título: `Luminária Pendente Macramê Trama Ninho`
   - Handle: `luminaria-pendente-macrame-ninho`
   - Preço: `56000` centavos (`R$ 560,00`)
   - Dimensões: `width_mm: 280`, `height_mm: 500`, `depth_mm: 280`
   - Peso: `850g`
   - Materiais: `['corda_algodao', 'aco_carbono_fosco', 'linho_puro']`
   - Artesão: `Ateliê Luz Orgânica Neruma` (`Minas Gerais / MG`, 7.0h produção manual)
   - Certificação sustentável: `Fibras 100% Naturais Livres de Químicos`, plástico-zero.

---

## 2. Logic Chain

1. **Raciocínio Geométrico do 3D (Observação 1)**:
   - A malha tem centro geométrico em `[-0.161, -0.124, -0.010]`.
   - Se adicionada à cena sem centralização, a rotação orbital oscilará excêntrica em torno de `(0,0,0)`.
   - Portanto, a malha deve ser envolvida no componente `<Center>` do `@react-three/drei` ou reposicionada com `geometry.center()`, assegurando giro concêntrico natural.

2. **Raciocínio de Iluminação e Normais (Observação 1)**:
   - Como os atributos contêm apenas `POSITION` e `TEXCOORD_0` (sem `NORMAL`), o Three.js não possui vetores normais para interpolação de iluminação suave.
   - Sem normais, a iluminação direcional ou pontual renderiza de forma facetada ou incorreta.
   - Portanto, no carregamento do modelo, a função `geometry.computeVertexNormals()` deve ser executada obrigatoriamente para garantir a renderização macia das tramas de algodão.

3. **Raciocínio de Performance & LCP (Observações 1 e 2)**:
   - O arquivo GLB possui 7,39 MB (com textura PNG de 5,89 MB), exigindo tempo de download e compilação de shader WebGL.
   - Para garantir Core Web Vitals (LCP < 2,5s e CLS < 0,1), a imagem estática `luminaria-macrame-algodao.jpg` deve ser exibida imediatamente como placeholder com prioridade de carregamento (`next/image priority`).
   - O componente 3D deve ser carregado progressivamente via `next/dynamic` com `ssr: false`.

4. **Raciocínio Estético Zenin Sound Speaker (Observações 3, 4 e 5)**:
   - O conceito Zenin utiliza um palco escuro dramático que valoriza texturas e iluminação do produto, contraposto a seções claras limpas.
   - O tema possui `neruma-dark` (`#1A1816`) e `neruma-charcoal` (`#2B2824`) para o Hero e `neruma-bg` (`#FAF8F5`) para as seções editoriais.
   - A transição entre os fundos deve ocorrer por meio de um divisor SVG orgânico em curva, preservando a identidade biofílica.
   - As especificações técnicas mapeadas (280x500x280mm, 850g, algodão/aço/linho, artesão de MG) devem ser organizadas em um Bento Grid com animação de scroll (`scale-in` e `slide-up`).

5. **Raciocínio de Integração e Não-Regressão (Observação 5)**:
   - Os outros produtos do catálogo (`painel-macrame-aura-algodao`, `quadro-escultura-raizes-sisal`) não possuem arquivo 3D `.glb`.
   - A PDP deve condicionar a renderização imersiva 3D: se o produto possui modelo 3D associado, renderiza a experiência Zenin; caso contrário, mantém 100% da PDP clássica funcional.

---

## 3. Caveats

- **WebGL em Dispositivos de Baixo Desempenho**: Dispositivos sem suporte a WebGL 2.0 ou GPUs muito restritas podem apresentar queda de framerate ao carregar a textura de 2048x2048 px (5,89 MB). O fallback para a imagem estática resolve a renderização quando WebGL falha.
- **Áreas não investigadas**: Não alteramos nem executamos `pnpm install` para manter estritamente o modo de leitura (`read-only investigation`). As verificações de dependências externas foram feitas via consultas de metadados (`pnpm view`).
- Nenhuma outra ressalva.

---

## 4. Conclusion

A investigação técnica conclui com êxito que o storefront do Neruma possui todos os ativos, dados de catálogo e tokens visuais necessários para construir a PDP 3D no estilo Zenin Sound Speaker.

### Plano de Ação Recomendado para o Implementador:
1. **Configuração de Cena 3D**:
   - Importar o modelo `public/models/luminaria-macrame-ninho.glb` com `useGLTF`.
   - Executar `mesh.geometry.computeVertexNormals()` em todas as geometrias da malha.
   - Envolver o modelo em `<Center>` para anular o deslocamento de `[-0.161, -0.124]`.
   - Iluminação: `ambientLight` (quente cremoso, 0.8), `directionalLight` principal `[3, 5, 4]` (1.8), `pointLight` interna suave na cúpula (1.2) simulando a luminária acesa.
   - `OrbitControls`: `autoRotate={true}`, `autoRotateSpeed={0.8}`, `enablePan={false}`, `minDistance={1.8}`, `maxDistance={4.5}`, limites angulares verticais.
2. **Layout & Estilo Zenin**:
   - Hero Section em `bg-neruma-dark` com halo ambarino radial centralizado.
   - Transição orgânica em curva SVG para o corpo em `bg-neruma-bg`.
   - 3 animações de scroll: `slide-up` (narrativa e títulos), `scale-in` (Bento Grid de especificações) e transição da barra flutuante de compra.
   - Seção Bento Grid com os 4 cartões técnicos: Dimensões (280x500x280mm), Massa (850g), Fibras Nobres (algodão cru/aço/linho) e Manufatura (Ateliê Luz Orgânica Neruma).
   - Bloco comercial com `R$ 560,00`, `R$ 532,00 no Pix (5% off)` e parcelamento em 10x sem juros.
3. **Respeito à Arquitetura**:
   - Condicional no Server Component `apps/storefront/app/(shop)/produto/[handle]/page.tsx` para chavear entre a PDP imersiva e a PDP clássica sem quebrar produtos sem 3D.

---

## 5. Verification Method

Para verificar de forma independente todas as observações e conclusões deste relatório:

1. **Inspeção do Arquivo 3D GLB**:
   ```bash
   node .agents/explorer_0_3/inspect_glb.js
   ```
   *Critério de validação*: Confirma os 7.749.172 bytes, 150.000 índices (50k triângulos), centro em `[-0.161, -0.124, -0.010]` e ausência de normais de vértice nos atributos.

2. **Inspeção dos Design Tokens**:
   Examine as linhas 11-41 de `apps/storefront/tailwind.config.ts`:
   *Critério de validação*: Confirma as definições de `neruma.bg`, `neruma.dark`, `neruma.charcoal`, `neruma.wood`, `neruma.terracotta` e `neruma.olive`.

3. **Verificação do Placeholder e Metadados do Produto**:
   Examine `apps/commerce/src/scripts/seed-3-products.ts` nas linhas 131-180.
   *Critério de validação*: Confirma SKU `NER-LUM-NIN-MCR`, dimensões 280x500x280mm, peso 850g, artesão Ateliê Luz Orgânica e thumbnail `/images/products/luminaria-macrame-algodao.jpg`.

4. **Condição de Invalidação**:
   O plano de normais e pivô seria invalidado se o arquivo GLB já contivesse o atributo `"NORMAL"` e centro perfeitamente em `(0,0,0)`, o que nossa inspeção binária provou não ser o caso.
