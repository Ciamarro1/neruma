import type { CollectionConfig } from 'payload';

export const Lookbooks: CollectionConfig = {
  slug: 'lookbooks',
  labels: {
    singular: 'Lookbook Interativo',
    plural: 'Lookbooks Interativos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'room', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título do Lookbook / Composição',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL',
      required: true,
      unique: true,
    },
    {
      name: 'room',
      type: 'relationship',
      relationTo: 'rooms',
      label: 'Ambiente Base',
      required: true,
    },
    {
      name: 'sceneImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem da Cena Completa',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição do Conceito Espacial',
    },
    {
      name: 'hotspots',
      type: 'array',
      label: 'Hotspots Interativos (Shop the Look)',
      admin: {
        description: 'Pontos clicáveis na imagem que abrem o card do produto Medusa.',
      },
      fields: [
        {
          name: 'xPercent',
          type: 'number',
          label: 'Posição Horizontal X (%)',
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: 'yPercent',
          type: 'number',
          label: 'Posição Vertical Y (%)',
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: 'medusaProductHandle',
          type: 'text',
          label: 'Handle do Produto Medusa',
          required: true,
        },
        {
          name: 'customLabel',
          type: 'text',
          label: 'Etiqueta Personalizada (Opcional)',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de Publicação',
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
