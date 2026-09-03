/**
 * ==============================================================================
 * NERUMA DOMAIN CONTRACT: AI PRODUCT INTELLIGENCE & MARKETING PIPELINE
 * ==============================================================================
 */

import { NerumaDesignData, NerumaProductDimensions } from './product.js';

export type AIJobType =
  | 'product_enrichment'
  | 'product_seo'
  | 'product_alt_text'
  | 'product_pinterest'
  | 'product_social';

export type AIJobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'dead_letter';

export interface AIJob {
  id: string;
  type: AIJobType;
  product_id: string;
  payload?: Record<string, unknown>;
  attempt: number;
  max_attempts: number;
  idempotency_key: string;
  status: AIJobStatus;
  created_at: string;
  updated_at?: string;
  error?: string;
}

export interface QualityGateRuleResult {
  rule_name: string;
  passed: boolean;
  message?: string;
}

export interface QualityGateResult {
  passed: boolean;
  confidence_score: number;
  routing: 'auto_publish' | 'human_review' | 'rejected';
  rules: QualityGateRuleResult[];
}

export interface ProductEnrichmentInput {
  raw_title: string;
  category: string;
  materials_detected: string[];
  dimensions: NerumaProductDimensions;
  lifestyle_image_urls: string[];
  notes?: string;
}

export interface PinterestPinDraft {
  board_name: string;
  title: string;
  description: string;
  link_url: string;
  target_keywords: string[];
}

export interface InstagramPostDraft {
  caption: string;
  hashtags: string[];
  call_to_action: string;
}

export interface ProductEnrichmentOutput {
  title_commercial: string;
  subtitle: string;
  slug: string;
  description_commercial_html: string;
  short_description: string;
  storytelling: string;
  design: NerumaDesignData;
  seo: {
    meta_title: string;
    meta_description: string;
    focus_keywords: string[];
    canonical_url?: string;
  };
  alt_texts: Record<string, string>; // image_url -> descriptive alt text
  marketing?: {
    pinterest_pins?: PinterestPinDraft[];
    instagram_post?: InstagramPostDraft;
    newsletter_snippet?: {
      subject_line: string;
      preview_text: string;
      body: string;
    };
  };
  suggested_categories: string[];
  suggested_tags: string[];
  confidence: number;
  telemetry?: {
    provider: string;
    model: string;
    prompt_version: string;
    latency_ms: number;
  };
}
