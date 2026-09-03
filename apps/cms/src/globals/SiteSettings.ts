import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações Gerais do Site',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      label: 'Nome da Marca',
      defaultValue: 'Neruma Design Orgânico',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Slogan / Conceito',
      defaultValue: 'A nobreza da madeira e a alma das fibras na sua casa',
    },
    {
      name: 'companyLegal',
      type: 'group',
      label: 'Dados Institucionais / Fiscais',
      fields: [
        {
          name: 'companyName',
          type: 'text',
          label: 'Razão Social',
        },
        {
          name: 'cnpj',
          type: 'text',
          label: 'CNPJ',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Endereço do Ateliê / Hub',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Canais de Atendimento',
      fields: [
        {
          name: 'supportEmail',
          type: 'email',
          label: 'E-mail de Suporte',
          defaultValue: 'contato@neruma.com.br',
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          label: 'WhatsApp de Atendimento (ex: 5511999999999)',
        },
        {
          name: 'supportHours',
          type: 'text',
          label: 'Horário de Atendimento',
          defaultValue: 'Segunda a Sexta, das 09h às 18h',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Redes Sociais',
      fields: [
        { name: 'instagramUrl', type: 'text', label: 'Instagram URL' },
        { name: 'pinterestUrl', type: 'text', label: 'Pinterest URL' },
        { name: 'youtubeUrl', type: 'text', label: 'YouTube URL' },
      ],
    },
  ],
};
