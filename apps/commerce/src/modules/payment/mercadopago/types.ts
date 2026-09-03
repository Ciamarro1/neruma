import { NerumaPaymentMethod } from '@neruma/types';

export interface MercadoPagoOptions {
  accessToken: string;
  publicKey?: string;
  webhookSecret?: string;
}

export interface MercadoPagoPaymentRequest {
  transaction_amount: number;
  description: string;
  payment_method_id: string; // 'pix', 'master', 'visa', 'bolbradesco'
  payer: {
    email: string;
    first_name: string;
    last_name: string;
    identification: {
      type: 'CPF' | 'CNPJ';
      number: string;
    };
  };
  token?: string; // Token do cartão de crédito
  installments?: number;
  notification_url?: string;
  external_reference: string;
}

export interface MercadoPagoPaymentResponse {
  id: number;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'rejected' | 'cancelled' | 'refunded';
  status_detail: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
  transaction_details?: {
    external_resource_url?: string;
    total_paid_amount: number;
    installment_amount: number;
  };
  card?: {
    last_four_digits: string;
    cardholder: {
      name: string;
    };
  };
}
