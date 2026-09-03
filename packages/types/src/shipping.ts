/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: SHIPPING & LOGISTICS (BRAZIL SPECIFIC)
 * ==============================================================================
 */

export interface ShippingAddressBR {
  postal_code: string; // CEP: 00000-000 ou 00000000
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string; // UF: SP, RJ, MG...
  country_code: 'br';
}

export interface ShippingItemSpec {
  id: string;
  title: string;
  quantity: number;
  unit_price_cents: number;
  weight_g: number;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  insurance_value_cents: number;
}

export interface ShippingQuoteInput {
  origin_postal_code: string;
  destination_postal_code: string;
  items: ShippingItemSpec[];
}

export interface ShippingRate {
  id: string;
  provider_id: string; // 'melhor-envio' | 'correios' | 'jadlog' | 'local-pickup'
  service_code: string; // e.g. 'PAC', 'SEDEX', '.Com', 'Package'
  service_name: string; // e.g. 'Correios SEDEX', 'Jadlog .Com'
  price_cents: number;
  currency: 'BRL';
  delivery_time_days: number;
  delivery_min_days?: number;
  delivery_max_days?: number;
  company_name: string;
  company_picture_url?: string;
  insurance_included: boolean;
}

export interface ShipmentInput {
  order_id: string;
  service_code: string;
  from_address: ShippingAddressBR;
  to_address: ShippingAddressBR;
  items: ShippingItemSpec[];
  total_declared_value_cents: number;
}

export interface Shipment {
  id: string;
  tracking_code: string;
  label_url?: string;
  protocol?: string;
  carrier: string;
  status: 'pending' | 'generated' | 'posted' | 'in_transit' | 'delivered' | 'canceled';
  created_at: string;
}

export interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  date_time: string;
}

export interface TrackingInfo {
  tracking_code: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'canceled';
  events: TrackingEvent[];
  estimated_delivery?: string;
}

/**
 * Interface de abstração de Provedor de Frete Neruma
 */
export interface NerumaShippingProvider {
  id: string;
  name: string;
  calculateRates(input: ShippingQuoteInput): Promise<ShippingRate[]>;
  createShipment(input: ShipmentInput): Promise<Shipment>;
  cancelShipment(shipmentId: string): Promise<void>;
  trackShipment(trackingCode: string): Promise<TrackingInfo>;
}
