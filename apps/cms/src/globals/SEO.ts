import type { GlobalConfig } from 'payload';

export const SEO: GlobalConfig = {
  slug: 'seo',
  label: 'SEO Global & Metadados',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'defaultMetaTitle',
      type: 'text',
      label: 'Meta Title Padrão',
      defaultValue: 'Neruma — Design Orgânico, Madeira Nobre & Fibras Naturais',
      required: true,
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
      label: 'Meta Description Padrão',
      defaultValue: 'Peças de decoração biofílica feitas à mão. Quadros em freijó, luminárias em fibras naturais e mobiliário pet minimalista para transformar seu lar.',
      required: true,
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem OpenGraph Padrão (Compartilhamento em Redes/WhatsApp)',
    },
    {
      name: 'twitterHandle',
      type: 'text',
      label: 'Twitter / X Handle',
      defaultValue: '@nerumadesign',
    },
    {
      name: 'structuredData',
      type: 'json',
      label: 'Schema.org JSON-LD Customizado',
    },
  ],
};
