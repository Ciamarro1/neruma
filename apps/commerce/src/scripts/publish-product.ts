import { ExecArgs } from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';

export default async function publishProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const link = container.resolve('link');

  const [product] = await productModule.listProducts({ handle: 'painel-organico-freijo-sisal' });
  const [salesChannel] = await salesChannelModule.listSalesChannels({ name: 'Loja Oficial Neruma' });

  if (product) {
    await (productModule as any).updateProducts(product.id, { status: 'published' });
    logger.info('✓ Status do produto alterado para published.');
  }

  if (link && product && salesChannel) {
    await link.create({
      [Modules.PRODUCT]: { product_id: product.id },
      [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
    });
    logger.info('✓ Produto vinculado ao canal de vendas.');
  }
}
