/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: CONTENT (PAYLOAD CMS EDITORIAL SCHEMAS)
 * ==============================================================================
 */

export interface EditorialCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  hero_image_url: string;
  storytelling_body_html: string;
  moodboard_images: string[];
  featured_product_ids: string[];
  materials_highlighted: string[];
  published_at: string;
}

export interface EditorialStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  content_json: unknown;
  cover_image_url: string;
  related_room?: string;
  related_style?: string;
  tags: string[];
  published_at: string;
}

export interface LookbookRoom {
  id: string;
  name: string; // e.g. "Sala de Estar Orgânica"
  image_url: string;
  hotspots: {
    x_percentage: number;
    y_percentage: number;
    product_id: string;
    product_name: string;
  }[];
}

/**
 * Ponto de foco na obra autoral durante a rolagem no Canvas
 */
export interface CinematicFocusWaypoint {
  id: string;
  x_percent: number; // 0.0 a 100.0 (centro do foco no plano da obra)
  y_percent: number; // 0.0 a 100.0 (centro do foco no plano da obra)
  zoom_scale: number; // 1.0 (visão total) a 4.0 (macro textura)
  lighting_mood: 'gallery_spot' | 'raking_light' | 'museum_ambient' | 'dramatic_contrast';
  label: string; // Ex: "Nó Central em Sisal"
  description: string; // Ex: "Fibra de sisal torcida à mão com diâmetro de 8mm"
}

/**
 * Ato narrativo da experiência scroll-driven
 */
export interface CinematicNarrativeAct {
  act_number: number; // 1 a 8
  title: string;
  subtitle?: string;
  prose: string;
  quote?: {
    text: string;
    author: string;
    role?: string;
  };
  highlight_facts?: Array<{
    label: string;
    value: string;
  }>;
  waypoint_id?: string;
  bg_theme: 'dark' | 'charcoal' | 'sand' | 'warm_stone';
}

/**
 * Configuração canônica da Landing Cinematográfica para Quadros e Arte Autoral
 */
export interface CinematicArtworkConfig {
  product_id: string;
  product_handle: string;
  artwork_asset_url: string; // Imagem original 1:1 imutável
  aspect_ratio: number; // ex: 0.75 (600 / 800)
  palette: {
    primary: string;
    background_dark: string;
    background_light: string;
    accent: string;
  };
  waypoints: CinematicFocusWaypoint[];
  acts: CinematicNarrativeAct[];
  curator_note?: string;
}

