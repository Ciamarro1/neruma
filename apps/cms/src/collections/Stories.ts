import type { CollectionConfig } from 'payload';

export const Stories: CollectionConfig = {
  slug: 'stories',
  labels: {
    singular: 'História / Artigo',
    plural: 'Histórias & Editorial',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'collection', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título da História',
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
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumo / Linha Fina',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      label: 'Autor / Curadoria',
      defaultValue: 'Equipe Neruma Design',
      required: true,
    },
    {
      name: 'readingTimeMinutes',
      type: 'number',
      label: 'Tempo de Leitura (Minutos)',
      defaultValue: 4,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de Capa',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Corpo da História (Texto Rico & Imagens)',
      required: true,
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'collections',
      label: 'Coleção Relacionada',
    },
    {
      name: 'relatedProductHandles',
      type: 'array',
      label: 'Produtos Medusa em Destaque nesta História',
      fields: [
        {
          name: 'handle',
          type: 'text',
          label: 'Handle do Produto',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      label: 'Tags de Conteúdo',
      options: [
        { label: 'Design Biofílico', value: 'biofilico' },
        { label: 'Madeira Maciça', value: 'madeira' },
        { label: 'Fibras Naturais', value: 'fibras' },
        { label: 'Artesanato Brasileiro', value: 'artesanato' },
        { label: 'Dicas de Ambientes', value: 'dicas' },
        { label: 'Guia de Cuidados', value: 'cuidados' },
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
