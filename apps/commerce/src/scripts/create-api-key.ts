import { ExecArgs } from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';

export default async function createKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const apiKeyModule = container.resolve(Modules.API_KEY);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);

  logger.info('Criando Publishable API Key...');
  const [salesChannel] = await salesChannelModule.listSalesChannels({ name: 'Loja Oficial Neruma' });

  let [existingKey] = await apiKeyModule.listApiKeys({ title: 'Neruma Storefront Key' });
  if (!existingKey) {
    existingKey = await apiKeyModule.createApiKeys({
      title: 'Neruma Storefront Key',
      type: 'publishable',
      created_by: 'system',
    });
    logger.info('✓ Chave criada: ' + existingKey.token);
  } else {
    logger.info('✓ Chave já existente: ' + existingKey.token);
  }

  const link = container.resolve('link');
  if (link && salesChannel) {
    await link.create({
      [Modules.API_KEY]: { publishable_key_id: existingKey.id },
      [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
    });
    logger.info('✓ Chave vinculada ao canal de vendas.');
  }
}
