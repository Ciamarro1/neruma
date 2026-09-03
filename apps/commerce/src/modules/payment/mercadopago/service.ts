import { AbstractPaymentProvider } from '@medusajs/framework/utils';
import { MercadoPagoClient } from './client.js';
import { MercadoPagoOptions, MercadoPagoPaymentRequest } from './types.js';

export class MercadoPagoPaymentProviderService extends AbstractPaymentProvider<MercadoPagoOptions> {
  static identifier = 'mercadopago';
  private mpClient: MercadoPagoClient;

  constructor(container: unknown, options: MercadoPagoOptions) {
    super(container, options);
    this.mpClient = new MercadoPagoClient(options);
  }

  async initiatePayment(input: any): Promise<any> {
    const { amount, currency_code, context, data } = input;
    const paymentMethod = data?.payment_method || 'pix';
    const idempotencyKey = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Monta a requisição para a API do Mercado Pago
    const paymentRequest: MercadoPagoPaymentRequest = {
      transaction_amount: Number(amount),
      description: `Pedido Neruma - ${context?.cart_id || 'Checkout'}`,
      payment_method_id: paymentMethod === 'pix' ? 'pix' : (data?.card_brand || 'master'),
      payer: {
        email: context?.customer?.email || data?.payer_email || 'cliente@neruma.com.br',
        first_name: context?.customer?.first_name || 'Cliente',
        last_name: context?.customer?.last_name || 'Neruma',
        identification: {
          type: 'CPF',
          number: data?.cpf ? data.cpf.replace(/\D/g, '') : '00000000000',
        },
      },
      external_reference: context?.cart_id || 'neruma_cart',
    };

    if (paymentMethod === 'credit_card') {
      paymentRequest.token = data?.card_token;
      paymentRequest.installments = data?.installments || 1;
    }

    const response = await this.mpClient.createPayment(paymentRequest, idempotencyKey);

    return {
      id: response.id.toString(),
      status: response.status === 'approved' ? 'authorized' : 'pending',
      data: {
        payment_id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        pix_qr_code: response.point_of_interaction?.transaction_data?.qr_code,
        pix_copia_e_cola: response.point_of_interaction?.transaction_data?.qr_code,
        pix_qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
      },
    };
  }

  async authorizePayment(paymentSessionData: any, context: any): Promise<any> {
    const paymentId = paymentSessionData?.payment_id || paymentSessionData?.id;
    if (!paymentId) {
      return { status: 'pending', data: paymentSessionData };
    }

    const payment = await this.mpClient.getPayment(paymentId);

    if (payment.status === 'approved') {
      return { status: 'authorized', data: payment };
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      return { status: 'failed', data: payment };
    }

    return { status: 'pending', data: payment };
  }

  async capturePayment(paymentData: any): Promise<any> {
    const paymentId = paymentData?.payment_id || paymentData?.id;
    const payment = await this.mpClient.getPayment(paymentId);

    return {
      id: payment.id.toString(),
      status: payment.status === 'approved' ? 'captured' : 'failed',
      data: payment,
    };
  }

  async refundPayment(paymentData: any, refundAmount?: number): Promise<any> {
    const paymentId = paymentData?.payment_id || paymentData?.id;
    const refund = await this.mpClient.refundPayment(paymentId, refundAmount);

    return {
      id: paymentId.toString(),
      data: refund,
    };
  }

  async cancelPayment(paymentData: any): Promise<any> {
    const paymentId = paymentData?.payment_id || paymentData?.id;
    const canceled = await this.mpClient.cancelPayment(paymentId);

    return {
      id: paymentId.toString(),
      data: canceled,
    };
  }

  async getWebhookActionAndData(payload: any): Promise<any> {
    const { type, data } = payload.data || payload;

    if (type === 'payment') {
      const payment = await this.mpClient.getPayment(data.id);
      if (payment.status === 'approved') {
        return {
          action: 'authorized',
          data: {
            session_id: payment.external_reference,
            amount: payment.transaction_details?.total_paid_amount,
          },
        };
      }
    }

    return { action: 'not_supported' };
  }
}
