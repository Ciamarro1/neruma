import { ExecArgs } from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { NerumaProductMetadata } from '@neruma/types';

export default async function seedThreeProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const link = container.resolve('link');

  logger.info('Iniciando cadastro dos 3 novos produtos de design autoral...');

  const [salesChannel] = await salesChannelModule.listSalesChannels({ name: 'Loja Oficial Neruma' });
  const [catQuadros] = await productModule.listProductCategories({ handle: 'quadros-e-paineis' });
  const [catLuminarias] = await productModule.listProductCategories({ handle: 'luminarias-organicas' });

  const productsToCreate = [
    {
      title: 'Painel Suspenso Macramê Aura em Algodão Cru',
      subtitle: 'Tapeçaria têxtil artesanal com bastão em madeira maciça e contas naturais',
      handle: 'painel-macrame-aura-algodao',
      description: 'Uma peça têxtil imponente e acolhedora, tecida manualmente em nós de macramê com cordão 100% algodão cru. Estruturada sobre bastão roliço em madeira maciça com detalhe sutil de contas naturais, conferindo ritmo e serenidade ao ambiente.',
      thumbnail: '/images/products/painel-macrame-algodao.jpg',
      category_id: catQuadros?.id,
      price: 48000, // R$ 480,00
      sku: 'NER-PNL-MCR-ALG',
      metadata: {
        design: {
          materials: ['corda_algodao', 'madeira_macica_jequitiba'],
          styles: ['boho_chic', 'organico', 'minimalista_quente'],
          rooms: ['sala_de_estar', 'quarto', 'hall_entrada'],
          colors: ['off_white', 'areia', 'madeira_natural'],
          finishes: ['cera_de_abelha', 'algodao_desfiado'],
        },
        dimensions: {
          width_mm: 720,
          height_mm: 580,
          depth_mm: 35,
        },
        shipping: {
          weight_g: 1100,
          package_width_mm: 800,
          package_height_mm: 150,
          package_depth_mm: 100,
          fragile: false,
          requires_assembly: false,
          special_handling_notes: 'Enrolado com proteção em papel kraft e tubete rígido.',
        },
        manufacturing: {
          production_time_hours: 6.0,
          artisan_name: 'Ateliê Fibras Neruma',
          workshop_location: 'São Paulo / SP',
          handmade_percentage: 100,
          bom: [
            { component_name: 'Bastão em Jequitibá Maciço', material: 'madeira_macica_jequitiba', quantity: 0.75, unit: 'm', unit_cost_cents: 2800 },
            { component_name: 'Cordão de Algodão Cru 4mm', material: 'corda_algodao', quantity: 95, unit: 'm', unit_cost_cents: 4500 },
            { component_name: 'Contas de Madeira Natural', material: 'madeira_macica_jequitiba', quantity: 12, unit: 'un', unit_cost_cents: 1800 },
          ],
        },
        sustainability: {
          reforestation_certified: true,
          certifications: ['Algodão Agroecológico Brasileiro', 'Madeira de Manejo Sustentável'],
          biodegradable: true,
          plastic_free_packaging: true,
        },
        merchandising: {
          is_featured: true,
          badge: 'Feito a Mao',
          season: 'Coleção Raízes 2026',
          display_priority: 2,
        },
      } as any as Record<string, unknown>,
    },
    {
      title: 'Quadro Escultura Raízes em Sisal & Moldura Freijó',
      subtitle: 'Composição tridimensional em relevo botânico esculpida em corda de fibra natural',
      handle: 'quadro-escultura-raizes-sisal',
      description: 'Inspirado na força vital das árvores ancestrais, este quadro em relevo têxtil é uma verdadeira escultura contemporânea. Cada galho e raiz é moldado e costurado manualmente em fibra de sisal torcido sobre base de algodão texturizado, emoldurado com a nobreza da madeira Freijó de manejo sustentável.',
      thumbnail: '/images/products/quadro-raizes-sisal.jpg',
      category_id: catQuadros?.id,
      price: 92000, // R$ 920,00
      sku: 'NER-QDR-RZS-SIS',
      metadata: {
        design: {
          materials: ['fibra_sisal', 'madeira_macica_freijo', 'corda_algodao'],
          styles: ['organico', 'wabi_sabi', 'minimalista_quente'],
          rooms: ['sala_de_estar', 'escritorio', 'quarto'],
          colors: ['areia', 'madeira_natural', 'off_white'],
          finishes: ['oleo_mineral', 'cera_de_abelha'],
        },
        dimensions: {
          width_mm: 600,
          height_mm: 800,
          depth_mm: 50,
        },
        shipping: {
          weight_g: 3800,
          package_width_mm: 680,
          package_height_mm: 880,
          package_depth_mm: 100,
          fragile: true,
          requires_assembly: false,
          special_handling_notes: 'Moldura em madeira maciça protegida por cantoneiras antichoque.',
        },
        manufacturing: {
          production_time_hours: 11.5,
          artisan_name: 'Ateliê Raízes Neruma',
          workshop_location: 'São Paulo / SP',
          handmade_percentage: 100,
          bom: [
            { component_name: 'Moldura em Caixa Freijó Maciço', material: 'madeira_macica_freijo', quantity: 2.8, unit: 'm', unit_cost_cents: 9500 },
            { component_name: 'Corda de Sisal Torcido Artesanal', material: 'fibra_sisal', quantity: 35, unit: 'm', unit_cost_cents: 4200 },
            { component_name: 'Painel de Fundo Rígido com Base em Algodão', material: 'corda_algodao', quantity: 1, unit: 'un', unit_cost_cents: 3800 },
          ],
        },
        sustainability: {
          reforestation_certified: true,
          certifications: ['Manejo Sustentável FSC', 'Fibras Naturais Biodegradáveis'],
          biodegradable: true,
          plastic_free_packaging: true,
        },
        merchandising: {
          is_featured: true,
          badge: 'Exclusivo',
          season: 'Coleção Raízes 2026',
          display_priority: 3,
        },
      } as any as Record<string, unknown>,
    },
    {
      title: 'Luminária Pendente Macramê Trama Ninho',
      subtitle: 'Cúpula artesanal em nós entrelaçados com difusão de luz acolhedora',
      handle: 'luminaria-pendente-macrame-ninho',
      description: 'Criada para envolver o ambiente com um jogo fascinante de luz e sombra, a luminária Ninho une a delicadeza dos nós de macramê à organicidade das franjas fluidas. A luz filtrada através da trama de algodão cria uma atmosfera de calma e bem-estar biofílico.',
      thumbnail: '/images/products/luminaria-macrame-algodao.jpg',
      category_id: catLuminarias?.id,
      price: 56000, // R$ 560,00
      sku: 'NER-LUM-NIN-MCR',
      metadata: {
        design: {
          materials: ['corda_algodao', 'aco_carbono_fosco', 'linho_puro'],
          styles: ['japandi', 'organico', 'boho_chic'],
          rooms: ['sala_de_jantar', 'quarto', 'varanda_coberta'],
          colors: ['off_white', 'areia', 'terracota'],
          finishes: ['cera_de_abelha', 'cru_lixado'],
        },
        dimensions: {
          width_mm: 280,
          height_mm: 500,
          depth_mm: 280,
        },
        shipping: {
          weight_g: 850,
          package_width_mm: 320,
          package_height_mm: 450,
          package_depth_mm: 320,
          fragile: true,
          requires_assembly: false,
          special_handling_notes: 'Caixa reforçada com proteção interna de papel colmeia.',
        },
        manufacturing: {
          production_time_hours: 7.0,
          artisan_name: 'Ateliê Luz Orgânica Neruma',
          workshop_location: 'Minas Gerais / MG',
          handmade_percentage: 100,
          bom: [
            { component_name: 'Aro Estrutural em Aço Cobreado', material: 'aco_carbono_fosco', quantity: 2, unit: 'un', unit_cost_cents: 2200 },
            { component_name: 'Cordão de Algodão Torcido 3.5mm', material: 'corda_algodao', quantity: 80, unit: 'm', unit_cost_cents: 3600 },
            { component_name: 'Kit Elétrico Bocal E27 com Fio Revestido em Linho', material: 'linho_puro', quantity: 1, unit: 'kit', unit_cost_cents: 4800 },
          ],
        },
        sustainability: {
          reforestation_certified: true,
          certifications: ['Fibras 100% Naturais Livres de Químicos'],
          biodegradable: true,
          plastic_free_packaging: true,
        },
        merchandising: {
          is_featured: true,
          badge: 'Lancamento',
          season: 'Coleção Raízes 2026',
          display_priority: 4,
        },
      } as any as Record<string, unknown>,
    },
  ];

  for (const item of productsToCreate) {
    let [existing] = await productModule.listProducts({ handle: item.handle });
    if (!existing) {
      const created = await (productModule as any).createProducts({
        title: item.title,
        subtitle: item.subtitle,
        handle: item.handle,
        description: item.description,
        thumbnail: item.thumbnail,
        images: [{ url: item.thumbnail }],
        status: 'published',
        discountable: true,
        category_ids: item.category_id ? [item.category_id] : [],
        metadata: item.metadata as unknown as Record<string, unknown>,
        options: [
          {
            title: 'Tamanho',
            values: ['Padrão'],
          },
        ],
        variants: [
          {
            title: 'Padrão',
            sku: item.sku,
            manage_inventory: false,
            options: {
              Tamanho: 'Padrão',
            },
            prices: [
              {
                amount: item.price,
                currency_code: 'brl',
              },
            ],
          },
        ],
      });

      if (link && created && salesChannel) {
        await link.create({
          [Modules.PRODUCT]: { product_id: created.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
        });
      }
      logger.info('✓ Produto "' + item.title + '" criado e vinculado ao canal.');
    } else {
      logger.info('✓ Produto "' + item.title + '" já existe.');
    }
  }

  logger.info('🎉 Cadastro dos 3 novos produtos concluído com sucesso!');
}
