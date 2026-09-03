import type { GlobalConfig } from 'payload';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navegação & Menus',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'topNotificationBar',
      type: 'group',
      label: 'Barra de Aviso Superior',
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Exibir Barra', defaultValue: true },
        { name: 'text', type: 'text', label: 'Texto do Aviso', defaultValue: 'Frete Grátis para todo o Brasil em compras acima de R$ 500 | Feito à mão sob encomenda' },
        { name: 'linkUrl', type: 'text', label: 'Link de Redirecionamento (Opcional)' },
      ],
    },
    {
      name: 'mainNav',
      type: 'array',
      label: 'Menu Principal (Header)',
      fields: [
        { name: 'label', type: 'text', label: 'Texto do Item', required: true },
        { name: 'url', type: 'text', label: 'Link / Rota', required: true },
        { name: 'isHighlight', type: 'checkbox', label: 'Destacar no Menu' },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Colunas do Rodapé',
      fields: [
        { name: 'title', type: 'text', label: 'Título da Coluna', required: true },
        {
          name: 'links',
          type: 'array',
          label: 'Links da Coluna',
          fields: [
            { name: 'label', type: 'text', label: 'Texto', required: true },
            { name: 'url', type: 'text', label: 'URL', required: true },
          ],
        },
      ],
    },
  ],
};
