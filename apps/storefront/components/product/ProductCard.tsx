import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatBRL, formatDimensions } from '../../lib/utils/formatters';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string;
    metadata?: any;
    variants?: any[];
  };
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  // Preço calculado pelo Medusa Commerce Engine
  const defaultVariant = product.variants?.[0];
  const calculatedPrice =
    defaultVariant?.calculated_price?.calculated_amount ||
    defaultVariant?.prices?.[0]?.amount ||
    0;

  const metadata = product.metadata || {};
  const dimensions = metadata.dimensions;
  const badge = metadata.merchandising?.badge || (metadata.sustainability?.reforestation_certified ? 'Madeira FSC' : null);
  const material = metadata.design?.materials?.[0]?.replace(/_/g, ' ') || null;

  return (
    <Link href={`/produto/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] bg-neruma-sand-100 rounded-neruma overflow-hidden mb-4 border border-neruma-border/60">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neruma-muted text-xs uppercase tracking-widest">
            Sem Imagem
          </div>
        )}

        {badge ? (
          <div className="absolute top-3 left-3">
            <Badge variant="wood">{badge}</Badge>
          </div>
        ) : null}
      </div>

      <div className="space-y-1">
        {material ? (
          <p className="text-[11px] uppercase tracking-wider text-neruma-muted">
            {material}
          </p>
        ) : null}

        <h3 className="font-serif text-base font-medium text-neruma-dark group-hover:text-neruma-wood transition-colors">
          {product.title}
        </h3>

        {dimensions ? (
          <p className="text-xs text-neruma-muted">
            {formatDimensions(dimensions.width_mm, dimensions.height_mm, dimensions.depth_mm)}
          </p>
        ) : null}

        <p className="text-sm font-semibold text-neruma-dark pt-1">
          {formatBRL(calculatedPrice, true)}
        </p>
      </div>
    </Link>
  );
};
