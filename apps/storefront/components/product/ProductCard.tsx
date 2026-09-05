import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatBRL, formatDimensions } from '../../lib/utils/formatters';
import { Badge } from '../ui/Badge';
import { Box } from 'lucide-react';

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
    defaultVariant?.calculated_price?.calculated_amount || 0;

  const metadata = product.metadata || {};
  const dimensions = metadata.dimensions;
  const badge =
    metadata.merchandising?.badge ||
    (metadata.sustainability?.reforestation_certified ? 'Madeira FSC' : null);
  const material = metadata.design?.materials?.[0]?.replace(/_/g, ' ') || null;
  const has3D = product.handle === 'luminaria-pendente-macrame-ninho';

  return (
    <Link href={`/produto/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] bg-[#1A1816] rounded-organic overflow-hidden mb-4 border border-white/10 group-hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-xl shadow-black/50">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neruma-sand-400/50 text-xs uppercase tracking-widest">
            Sem Imagem
          </div>
        )}

        {/* Gradiente sutil inferior na foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Badge Comercial */}
        {badge ? (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="wood">{badge}</Badge>
          </div>
        ) : null}

        {/* Indicador 3D para produtos com modelo */}
        {has3D && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] text-neruma-sand-200 font-medium tracking-wider uppercase">
            <Box className="w-3 h-3 text-neruma-terracotta-light" />
            <span>3D</span>
          </div>
        )}
      </div>

      <div className="space-y-1 px-1">
        {material ? (
          <p className="text-[11px] uppercase tracking-wider text-neruma-terracotta-light font-medium">
            {material}
          </p>
        ) : null}

        <h3 className="font-serif text-base font-medium text-white group-hover:text-neruma-sand-200 transition-colors line-clamp-1">
          {product.title}
        </h3>

        {dimensions ? (
          <p className="text-xs text-neruma-sand-400/70 font-light">
            {formatDimensions(dimensions.width_mm, dimensions.height_mm, dimensions.depth_mm)}
          </p>
        ) : null}

        <p className="text-base font-bold text-white pt-0.5 tracking-tight">
          {formatBRL(calculatedPrice, true)}
        </p>
      </div>
    </Link>
  );
};
