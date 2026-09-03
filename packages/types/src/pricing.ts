/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: PRICING & INVENTORY
 * ==============================================================================
 */

export interface NerumaPrice {
  amount_cents: number;
  currency_code: 'BRL';
  compare_at_amount_cents?: number; // Preço original / "de R$ X por R$ Y"
  min_quantity?: number;
  max_quantity?: number;
}

export interface NerumaPriceBreakdown {
  raw_materials_cents: number;
  artisan_labor_cents: number;
  packaging_cost_cents: number;
  taxes_included_cents: number;
  operating_margin_percentage: number;
}

export interface NerumaStockLocation {
  id: string;
  name: string;
  address_postal_code: string;
}

export interface NerumaInventoryLevel {
  variant_id: string;
  location_id: string;
  stocked_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  allow_backorder: boolean;
  lead_time_days_if_made_to_order?: number; // Prazo de produção artesanal
}
