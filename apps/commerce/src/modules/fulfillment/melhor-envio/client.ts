import axios, { AxiosInstance } from 'axios';
import { MelhorEnvioCalculateRequest, MelhorEnvioOptions, MelhorEnvioServiceRate } from './types';

export class MelhorEnvioClient {
  private client: AxiosInstance;

  constructor(private options: MelhorEnvioOptions) {
    const baseURL = options.sandbox
      ? 'https://sandbox.melhorenvio.com.br/api/v2/me'
      : 'https://melhorenvio.com.br/api/v2/me';

    this.client = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.apiToken}`,
        'User-Agent': 'NerumaCommerce/1.0 (contato@neruma.com.br)',
      },
      timeout: 12000,
    });
  }

  async calculateRates(request: MelhorEnvioCalculateRequest): Promise<MelhorEnvioServiceRate[]> {
    const response = await this.client.post<MelhorEnvioServiceRate[]>('/shipment/calculate', request);
    // Filtra serviços com erro retornado pela transportadora
    return response.data.filter((rate) => !rate.error);
  }

  async createCartItem(shipmentData: unknown): Promise<unknown> {
    const response = await this.client.post('/cart', shipmentData);
    return response.data;
  }

  async checkoutCart(orderIds: string[]): Promise<unknown> {
    const response = await this.client.post('/shipment/checkout', { orders: orderIds });
    return response.data;
  }

  async generateLabel(orderIds: string[]): Promise<unknown> {
    const response = await this.client.post('/shipment/print', { orders: orderIds });
    return response.data;
  }

  async getTracking(trackingCode: string): Promise<unknown> {
    const response = await this.client.get(`/shipment/tracking?tracking=${trackingCode}`);
    return response.data;
  }
}
