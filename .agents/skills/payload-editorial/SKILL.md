---
name: payload-editorial
description: Procedimentos de desenvolvimento e modelagem no Payload CMS 3.0 (apps/cms), incluindo coleções editoriais (Lookbooks, Stories, Guias), integração S3 SeaweedFS e revalidação on-demand.
---

# Payload CMS 3.0 Editorial Skill — Neruma

Esta habilidade orienta o gerenciamento de conteúdo editorial e mídia na camada do Payload CMS 3.0 (`apps/cms`).

## 1. Responsabilidade
- Gerenciar as coleções editoriais:
  - `Lookbooks`: Cenas fotográficas de alto padrão com hotspots percentuais (`x%`, `y%`) apontando para `medusaProductId`.
  - `Stories`: Artigos longform da revista digital com tempo estimado de leitura e produtos citados.
  - `Rooms`: Ambientes biofílicos e diretrizes de harmonização estética.
  - `Guides`: Manuais de conservação e restauração de madeira nobre e fibras naturais.
  - `Media`: Armazenamento de imagens no gateway S3 (SeaweedFS / MinIO) com dimensões responsivas e alt-text obrigatório.
- Recepção de rascunhos de enriquecimento do AI Worker com status `_status: 'draft'`.

## 2. Comandos Frequentes
```bash
# Navegar até a aplicação
cd apps/cms

# Instalar dependências
pnpm install

# Gerar tipos do Payload para TypeScript
pnpm generate:types

# Iniciar servidor em desenvolvimento (porta 3001)
pnpm dev
```

## 3. Diretrizes de Integração
- **Human-in-the-Loop:** Rascunhos gravados pelo worker de IA (`Neruma AI Curator`) nunca devem ter o status alterado para `published` programaticamente. Apenas curadores humanos publicam no painel.
- **On-Demand ISR:** Ao publicar ou atualizar coleções, o hook de collection deve disparar requisição HTTP para a rota de revalidação do Storefront: `POST /api/revalidate?secret=...&tag=editorial`.
