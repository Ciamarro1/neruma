import type { CollectionConfig } from 'payload';

export const Guides: CollectionConfig = {
  slug: 'guides',
  labels: {
    singular: 'Guia de Cuidados & Estilo',
    plural: 'Guias & Tutoriais',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título do Guia',
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
      name: 'category',
      type: 'select',
      label: 'Categoria do Guia',
      required: true,
      options: [
        { label: 'Conservação de Madeira Maciça', value: 'madeira_cuidados' },
        { label: 'Limpeza de Sisal & Fibras', value: 'fibras_cuidados' },
        { label: 'Instalação & Fixação de Quadros Pesados', value: 'instalacao' },
        { label: 'Iluminação Quente & Biofilia', value: 'iluminacao' },
        { label: 'Mobiliário Pet: Higienização & Adaptação', value: 'pet_cuidados' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de Capa',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Resumo / Destaque',
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Passo a Passo / Instruções',
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          label: 'Passo',
          required: true,
        },
        {
          name: 'stepTitle',
          type: 'text',
          label: 'Título do Passo',
          required: true,
        },
        {
          name: 'instruction',
          type: 'textarea',
          label: 'Instrução Detalhada',
          required: true,
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
