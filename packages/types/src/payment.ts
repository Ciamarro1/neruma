/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: PAYMENT (BRAZIL SPECIFIC)
 * ==============================================================================
 */

export type NerumaPaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface PixPaymentData {
  qr_code: string;
  qr_code_base64?: string;
  copia_e_cola: string;
  expires_at: string;
}

export interface CreditCardPaymentData {
  card_token: string;
  installments: number;
  statement_descriptor?: string;
  card_holder: {
    name: string;
    cpf_cnpj: string;
  };
}

export interface BoletoPaymentData {
  barcode: string;
  digitable_line: string;
  pdf_url: string;
  due_date: string;
}

export interface PaymentSessionInput {
  order_id: string;
  amount_cents: number;
  currency: 'BRL';
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    cpf_cnpj: string;
    phone: string;
  };
  billing_address: {
    postal_code: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country_code: 'br';
  };
  payment_method: NerumaPaymentMethod;
  card_data?: CreditCardPaymentData;
  metadata?: Record<string, unknown>;
}

export interface PaymentSessionResult {
  session_id: string;
  provider_id: string;
  status: 'pending' | 'authorized' | 'captured' | 'failed' | 'requires_action';
  amount_cents: number;
  currency: 'BRL';
  pix_data?: PixPaymentData;
  boleto_data?: BoletoPaymentData;
  card_last_four?: string;
  card_brand?: string;
  installments?: number;
  external_reference?: string;
}

export interface PaymentCaptureResult {
  payment_id: string;
  status: 'captured' | 'failed';
  captured_amount_cents: number;
  transaction_id: string;
}

export interface PaymentRefundResult {
  payment_id: string;
  status: 'refunded' | 'partially_refunded' | 'failed';
  refunded_amount_cents: number;
  refund_id: string;
}

export interface WebhookPaymentEvent {
  event_type: 'payment.authorized' | 'payment.captured' | 'payment.failed' | 'payment.refunded';
  provider_id: string;
  payment_id: string;
  order_id?: string;
  status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
  raw_payload: unknown;
}

/**
 * Interface de abstração de Provedor de Pagamento Neruma
 */
export interface NerumaPaymentProvider {
  id: string;
  name: string;
  createPayment(input: PaymentSessionInput): Promise<PaymentSessionResult>;
  authorizePayment(sessionId: string): Promise<PaymentSessionResult>;
  capturePayment(sessionId: string): Promise<PaymentCaptureResult>;
  refundPayment(sessionId: string, amount_cents?: number): Promise<PaymentRefundResult>;
  cancelPayment(sessionId: string): Promise<void>;
  handleWebhook(rawEvent: unknown, headers: Record<string, string>): Promise<WebhookPaymentEvent>;
}
