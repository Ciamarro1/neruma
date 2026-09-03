/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: ORDER & CUSTOMER
 * ==============================================================================
 */

import { ShippingAddressBR, ShippingRate } from './shipping.js';
import { PaymentSessionResult } from './payment.js';

export type NerumaOrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'in_production' // Artesanato sob encomenda
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'refunded';

export interface NerumaCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  addresses: ShippingAddressBR[];
  created_at: string;
}

export interface NerumaOrderItem {
  id: string;
  variant_id: string;
  product_id: string;
  title: string;
  variant_title?: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
  thumbnail_url?: string;
}

export interface NerumaOrder {
  id: string;
  display_id: number;
  status: NerumaOrderStatus;
  customer: NerumaCustomer;
  shipping_address: ShippingAddressBR;
  billing_address: ShippingAddressBR;
  items: NerumaOrderItem[];
  shipping_method: ShippingRate;
  payment_session: PaymentSessionResult;
  subtotal_cents: number;
  shipping_total_cents: number;
  discount_total_cents: number;
  total_cents: number;
  tracking_code?: string;
  created_at: string;
}
