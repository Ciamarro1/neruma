import type { CollectionConfig } from 'payload';

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  labels: {
    singular: 'Ambiente / Cômodo',
    plural: 'Ambientes & Espaços',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome do Ambiente',
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
      name: 'roomType',
      type: 'select',
      label: 'Tipo de Cômodo',
      required: true,
      options: [
        { label: 'Sala de Estar', value: 'sala_de_estar' },
        { label: 'Quarto', value: 'quarto' },
        { label: 'Sala de Jantar', value: 'sala_de_jantar' },
        { label: 'Varanda Coberta', value: 'varanda_coberta' },
        { label: 'Home Office / Escritório', value: 'escritorio' },
        { label: 'Hall de Entrada', value: 'hall_entrada' },
        { label: 'Espaço Pet Integrado', value: 'espaco_pet' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem Representativa',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Conceito e Orientações para este Espaço',
    },
    {
      name: 'decorTips',
      type: 'array',
      label: 'Dicas Práticas de Harmonização',
      fields: [
        {
          name: 'tipTitle',
          type: 'text',
          label: 'Título da Dica',
          required: true,
        },
        {
          name: 'tipText',
          type: 'textarea',
          label: 'Explicação',
          required: true,
        },
      ],
    },
  ],
};
