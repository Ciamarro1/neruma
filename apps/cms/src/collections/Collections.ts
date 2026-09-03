import type { CollectionConfig } from 'payload';

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: 'Coleção Editorial',
    plural: 'Coleções Editoriais',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isFeatured', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título da Coleção',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL',
      required: true,
      unique: true,
      admin: {
        description: 'Exemplo: raizes-freijo-e-sisal',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo Poético / Conceito',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Destacar na Home / Storefront',
      defaultValue: false,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem Hero (Banner Principal)',
      required: true,
    },
    {
      name: 'storytellingBody',
      type: 'richText',
      label: 'Narrativa & Inspiração da Coleção',
    },
    {
      name: 'materialsHighlighted',
      type: 'select',
      hasMany: true,
      label: 'Materiais em Destaque',
      options: [
        { label: 'Freijó Maciço', value: 'madeira_macica_freijo' },
        { label: 'Cumaru Maciço', value: 'madeira_macica_cumaru' },
        { label: 'Bambu Natural', value: 'bambu_natural' },
        { label: 'Fibra de Sisal', value: 'fibra_sisal' },
        { label: 'Corda de Algodão', value: 'corda_algodao' },
        { label: 'Cerâmica Artesanal', value: 'ceramica_artesanal' },
        { label: 'Linho Puro', value: 'linho_puro' },
      ],
    },
    {
      name: 'medusaProductHandles',
      type: 'array',
      label: 'Produtos Vinculados do Medusa (por Slug/Handle)',
      admin: {
        description: 'Handles dos produtos Medusa pertencentes a esta coleção.',
      },
      fields: [
        {
          name: 'handle',
          type: 'text',
          label: 'Handle do Produto Medusa (ex: painel-organico-freijo-sisal)',
          required: true,
        },
        {
          name: 'displayOrder',
          type: 'number',
          label: 'Ordem de Exibição',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'moodboardGallery',
      type: 'array',
      label: 'Galeria Moodboard / Inspirações',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'rooms',
      type: 'relationship',
      relationTo: 'rooms',
      hasMany: true,
      label: 'Ambientes Recomendados',
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
