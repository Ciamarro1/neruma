import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Mídia / Imagem',
    plural: 'Biblioteca de Mídia',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/mp4', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'lifestyle',
        width: 1200,
        height: 1200,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo (Alt Text - SEO & Acessibilidade)',
      required: true,
      admin: {
        description: 'Descreva a imagem em detalhes para motores de busca e leitores de tela.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Legenda Editorial',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoria de Mídia',
      options: [
        { label: 'Produto Isolado (Fundo Neutro)', value: 'product_packshot' },
        { label: 'Ambiente / Lifestyle', value: 'lifestyle_room' },
        { label: 'Detalhe de Material / Textura', value: 'material_detail' },
        { label: 'Processo Artesanal / Produção', value: 'artisan_process' },
        { label: 'Lookbook / Editorial', value: 'lookbook' },
      ],
      defaultValue: 'lifestyle_room',
    },
    {
      name: 'focalPoint',
      type: 'point',
      label: 'Ponto Focal para Recorte',
    },
  ],
};
