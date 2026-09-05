import axios, { AxiosInstance } from 'axios';
import { MercadoPagoOptions, MercadoPagoPaymentRequest, MercadoPagoPaymentResponse } from './types';

export class MercadoPagoClient {
  private client: AxiosInstance;

  constructor(private options: MercadoPagoOptions) {
    this.client = axios.create({
      baseURL: 'https://api.mercadopago.com/v1',
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  async createPayment(data: MercadoPagoPaymentRequest, idempotencyKey: string): Promise<MercadoPagoPaymentResponse> {
    const response = await this.client.post<MercadoPagoPaymentResponse>('/payments', data, {
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  }

  async getPayment(paymentId: string | number): Promise<MercadoPagoPaymentResponse> {
    const response = await this.client.get<MercadoPagoPaymentResponse>(`/payments/${paymentId}`);
    return response.data;
  }

  async refundPayment(paymentId: string | number, amount?: number): Promise<unknown> {
    const payload = amount ? { amount } : {};
    const response = await this.client.post(`/payments/${paymentId}/refunds`, payload);
    return response.data;
  }

  async cancelPayment(paymentId: string | number): Promise<MercadoPagoPaymentResponse> {
    const response = await this.client.put<MercadoPagoPaymentResponse>(`/payments/${paymentId}`, {
      status: 'cancelled',
    });
    return response.data;
  }
}
