import { AbstractFulfillmentProvider } from '@medusajs/framework/utils';
import { MelhorEnvioClient } from './client.js';
import { MelhorEnvioOptions, MelhorEnvioCalculateRequest } from './types.js';

export class MelhorEnvioFulfillmentService extends AbstractFulfillmentProvider<MelhorEnvioOptions> {
  static identifier = 'melhor-envio';
  private meClient: MelhorEnvioClient;
  private originPostalCode: string;

  constructor(container: unknown, options: MelhorEnvioOptions) {
    super(container, options);
    this.meClient = new MelhorEnvioClient(options);
    this.originPostalCode = options.originPostalCode?.replace(/\D/g, '') || '01310100';
  }

  async canCalculate(data: any): Promise<boolean> {
    return true;
  }

  async calculatePrice(optionData: any, data: any, context: any): Promise<number> {
    const destinationPostalCode =
      context?.shipping_address?.postal_code?.replace(/\D/g, '') ||
      data?.postal_code?.replace(/\D/g, '');

    if (!destinationPostalCode || destinationPostalCode.length !== 8) {
      return 0;
    }

    // Itens do carrinho com dimensões de produto Neruma (convertidos de mm/g para cm/kg)
    const items = context?.items || [];
    const products = items.map((item: any) => {
      const metadata = item.variant?.product?.metadata || {};
      const shippingMeta = metadata.shipping || {};

      return {
        id: item.id || 'item',
        quantity: item.quantity || 1,
        unitary_value: (item.unit_price || 1000) / 100,
        weight: (shippingMeta.weight_g || 1000) / 1000, // g -> kg
        width: Math.max(11, (shippingMeta.package_width_mm || 200) / 10), // mm -> cm (mínimo Correios: 11cm)
        height: Math.max(2, (shippingMeta.package_height_mm || 150) / 10), // mm -> cm (mínimo Correios: 2cm)
        length: Math.max(16, (shippingMeta.package_depth_mm || 200) / 10), // mm -> cm (mínimo Correios: 16cm)
      };
    });

    const calculateReq: MelhorEnvioCalculateRequest = {
      from: {
        postal_code: this.originPostalCode,
      },
      to: {
        postal_code: destinationPostalCode,
      },
      products: products.length > 0 ? products : undefined,
      package:
        products.length === 0
          ? {
              weight: 1.0,
              width: 20,
              height: 15,
              length: 25,
            }
          : undefined,
      services: optionData?.service_id?.toString() || '1,2,3', // 1=PAC, 2=SEDEX, 3=.Com
    };

    try {
      const rates = await this.meClient.calculateRates(calculateReq);
      const selectedServiceId = optionData?.service_id;

      const rate = rates.find((r) => r.id === Number(selectedServiceId)) || rates[0];
      if (rate) {
        // Converte valor BRL (ex: "25.50") para centavos (2550)
        return Math.round(parseFloat(rate.custom_price || rate.price) * 100);
      }
      return 2500; // Fallback seguro R$ 25,00 se a API falhar
    } catch (error) {
      console.error('[MelhorEnvio] Erro ao cotar frete:', error);
      return 3000; // Taxa de segurança padrão
    }
  }

  async createFulfillment(data: any, items: any, order: any, fulfillment: any): Promise<any> {
    return {
      status: 'created',
      data: {
        provider: 'melhor-envio',
        created_at: new Date().toISOString(),
      },
    };
  }

  async cancelFulfillment(fulfillment: any): Promise<any> {
    return {
      status: 'canceled',
    };
  }

  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: 'melhor-envio-pac',
        name: 'Correios PAC (Econômico)',
        service_id: 1,
      },
      {
        id: 'melhor-envio-sedex',
        name: 'Correios SEDEX (Expresso)',
        service_id: 2,
      },
      {
        id: 'melhor-envio-jadlog-package',
        name: 'Jadlog Package',
        service_id: 3,
      },
      {
        id: 'melhor-envio-jadlog-com',
        name: 'Jadlog .Com (Rápido)',
        service_id: 4,
      },
    ];
  }

  async validateFulfillmentData(optionData: any, data: any, context: any): Promise<any> {
    return data;
  }

  async validateOption(data: any): Promise<boolean> {
    return true;
  }
}
