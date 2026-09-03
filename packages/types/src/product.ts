/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: PRODUCT
 * ==============================================================================
 */

export type NerumaMaterial =
  | 'madeira_macica_freijo'
  | 'madeira_macica_cumaru'
  | 'madeira_macica_jequitiba'
  | 'bambu_natural'
  | 'fibra_sisal'
  | 'corda_algodao'
  | 'ceramica_artesanal'
  | 'aco_carbono_fosco'
  | 'vidro_canelado'
  | 'linho_puro';

export type NerumaStyle =
  | 'japandi'
  | 'boho_chic'
  | 'organico'
  | 'rustico_moderno'
  | 'minimalista_quente'
  | 'wabi_sabi';

export type NerumaRoom =
  | 'sala_de_estar'
  | 'quarto'
  | 'sala_de_jantar'
  | 'varanda_coberta'
  | 'escritorio'
  | 'hall_entrada'
  | 'espaco_pet';

export type NerumaColorPalette =
  | 'madeira_natural'
  | 'nogueira_escuro'
  | 'palha_clara'
  | 'terracota'
  | 'verde_oliva'
  | 'areia'
  | 'preto_fosco'
  | 'off_white';

export interface NerumaProductDimensions {
  width_mm: number;
  height_mm: number;
  depth_mm: number;
}

export interface NerumaPackageDimensions {
  weight_g: number;
  package_width_mm: number;
  package_height_mm: number;
  package_depth_mm: number;
  fragile: boolean;
  requires_assembly: boolean;
  special_handling_notes?: string;
}

export interface NerumaManufacturingBOMItem {
  component_name: string;
  material: NerumaMaterial;
  quantity: number;
  unit: 'un' | 'cm' | 'm' | 'kg' | 'g';
  supplier_id?: string;
  unit_cost_cents?: number;
}

export interface NerumaManufacturingData {
  production_time_hours: number;
  artisan_name?: string;
  workshop_location?: string;
  bom: NerumaManufacturingBOMItem[];
  handmade_percentage: number; // 0 to 100
}

export interface NerumaSustainabilityData {
  reforestation_certified: boolean;
  certifications?: string[]; // e.g. ["FSC", "Origem Brasil"]
  biodegradable: boolean;
  plastic_free_packaging: boolean;
}

export interface NerumaDesignData {
  materials: NerumaMaterial[];
  styles: NerumaStyle[];
  rooms: NerumaRoom[];
  colors: NerumaColorPalette[];
  finishes: ('oleo_mineral' | 'cera_de_abelha' | 'verniz_fosco' | 'cru_lixado')[];
}

export interface NerumaCommercialData {
  title: string;
  subtitle?: string;
  slug: string;
  description_commercial: string;
  short_description: string;
  story_text?: string;
  collection_id?: string;
  category_handles: string[];
  tags: string[];
}

/**
 * Contrato de Metadados embutido no Medusa v2 (Custom Metadata JSON)
 */
export interface NerumaProductMetadata {
  design: NerumaDesignData;
  dimensions: NerumaProductDimensions;
  shipping: NerumaPackageDimensions;
  manufacturing?: NerumaManufacturingData;
  sustainability: NerumaSustainabilityData;
  merchandising?: {
    is_featured: boolean;
    badge?: 'Lancamento' | 'Exclusivo' | 'Feito a Mao' | 'Edicao Limitada';
    season?: string;
    display_priority?: number;
  };
}
