import { ExecArgs } from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { NerumaProductMetadata } from '@neruma/types';

export default async function seedBrazil({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const regionService = container.resolve(Modules.REGION);
  const productModule = container.resolve(Modules.PRODUCT);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);

  logger.info('Iniciando Seeding de Região Brasil, Moeda BRL e Catálogo Inicial Neruma...');

  // 1. Criar ou Obter Canal de Vendas Neruma
  let [defaultSalesChannel] = await salesChannelModule.listSalesChannels({
    name: 'Loja Oficial Neruma',
  });

  if (!defaultSalesChannel) {
    defaultSalesChannel = await salesChannelModule.createSalesChannels({
      name: 'Loja Oficial Neruma',
      description: 'Canal de vendas digital e-commerce Neruma',
      is_disabled: false,
    });
    logger.info('✓ Canal de vendas "Loja Oficial Neruma" criado.');
  }

  // 2. Criar Região Brasil (BRL, Taxas Inclusas)
  let [brazilRegion] = await regionService.listRegions({
    currency_code: 'brl',
  });

  if (!brazilRegion) {
    brazilRegion = await regionService.createRegions({
      name: 'Brasil',
      currency_code: 'brl',
      countries: ['br'],
      automatic_taxes: true,
      is_tax_inclusive: true,
      payment_providers: ['mercadopago'],
    });
    logger.info('✓ Região Brasil (BRL, Taxas Inclusas) configurada.');
  }

  // 3. Criar Categorias de Decoração Orgânica Neruma
  const categoriesToCreate = [
    { name: 'Quadros & Painéis Botânicos', handle: 'quadros-e-paineis' },
    { name: 'Luminárias em Fibras & Madeira', handle: 'luminarias-organicas' },
    { name: 'Mobiliário Pet Japandi', handle: 'mobiliario-pet' },
    { name: 'Vasos & Cachepots Artesanais', handle: 'vasos-e-cachepots' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoriesToCreate) {
    let [existingCat] = await productModule.listProductCategories({
      handle: cat.handle,
    });
    if (!existingCat) {
      existingCat = await productModule.createProductCategories({
        name: cat.name,
        handle: cat.handle,
        is_active: true,
        is_internal: false,
      });
      logger.info(`✓ Categoria "${cat.name}" criada.`);
    }
    createdCategories[cat.handle] = existingCat.id;
  }

  // 4. Criar Produto Exemplo com Contrato Estrito NerumaProductMetadata
  const sampleMetadata: NerumaProductMetadata = {
    design: {
      materials: ['madeira_macica_freijo', 'fibra_sisal', 'linho_puro'],
      styles: ['japandi', 'organico', 'minimalista_quente'],
      rooms: ['sala_de_estar', 'quarto'],
      colors: ['madeira_natural', 'areia', 'off_white'],
      finishes: ['oleo_mineral', 'cera_de_abelha'],
    },
    dimensions: {
      width_mm: 600,
      height_mm: 900,
      depth_mm: 45,
    },
    shipping: {
      weight_g: 3200, // 3.2 kg
      package_width_mm: 680,
      package_height_mm: 980,
      package_depth_mm: 100,
      fragile: true,
      requires_assembly: false,
      special_handling_notes: 'Moldura de madeira nobre e tela protegida por cantoneiras acolchoadas.',
    },
    manufacturing: {
      production_time_hours: 8.5,
      artisan_name: 'Ateliê Raízes Neruma',
      workshop_location: 'São Paulo / SP',
      handmade_percentage: 100,
      bom: [
        {
          component_name: 'Moldura em Freijó Maciço',
          material: 'madeira_macica_freijo',
          quantity: 3.2,
          unit: 'm',
          unit_cost_cents: 8500,
        },
        {
          component_name: 'Trama em Fibra de Sisal Natural',
          material: 'fibra_sisal',
          quantity: 1.5,
          unit: 'm',
          unit_cost_cents: 3500,
        },
      ],
    },
    sustainability: {
      reforestation_certified: true,
      certifications: ['Madeira de Manejo Sustentável FSC'],
      biodegradable: true,
      plastic_free_packaging: true,
    },
    merchandising: {
      is_featured: true,
      badge: 'Feito a Mao',
      season: 'Coleção Raízes 2026',
      display_priority: 1,
    },
  };

  const [existingProduct] = await productModule.listProducts({
    handle: 'painel-organico-freijo-sisal',
  });

  if (!existingProduct) {
    await productModule.createProducts({
      title: 'Painel Orgânico Freijó & Sisal',
      subtitle: 'Design biofílico feito à mão com madeira nobre de manejo sustentável',
      handle: 'painel-organico-freijo-sisal',
      description:
        'Uma obra de arte viva que une a nobreza e os veios marcantes do Freijó maciço à rusticidade acolhedora da fibra de sisal tecida à mão.',
      is_giftcard: false,
      discountable: true,
      category_ids: [createdCategories['quadros-e-paineis']],
      metadata: sampleMetadata as unknown as Record<string, unknown>,
      options: [
        {
          title: 'Dimensão',
          values: ['60x90cm', '80x120cm'],
        },
      ],
      variants: [
        {
          title: '60x90cm (Padrão)',
          sku: 'NER-PNL-6090-FRJ',
          manage_inventory: true,
          prices: [
            {
              amount: 890, // R$ 890,00
              currency_code: 'brl',
            },
          ],
        },
      ],
    });
    logger.info('✓ Produto de referência "Painel Orgânico Freijó & Sisal" criado com metadados completos.');
  }

  logger.info('🎉 Seed da Região Brasil e Catálogo Neruma concluído com sucesso!');
}
