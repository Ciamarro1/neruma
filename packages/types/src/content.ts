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
