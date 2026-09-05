import React from 'react';
import { notFound } from 'next/navigation';
import { ProductJsonLd, BreadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { constructMetadata } from '../../../../lib/seo/metadata';
import { formatBRL, formatDimensions, formatWeight } from '../../../../lib/utils/formatters';
import { getProductByHandle } from '../../../../lib/medusa/products';
import { ProductImmersivePDP } from '../../../../components/product/ProductImmersivePDP';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

/**
 * Mapeamento de handles para modelos 3D (.glb).
 * Se o produto possuir entrada neste mapa, ele exibirá o botão interativo
 * de visualização 3D na galeria, abrindo inicialmente na fotografia.
 */
const PRODUCT_3D_MODELS: Record<string, string> = {
  'luminaria-pendente-macrame-ninho': '/models/luminaria-macrame-ninho.glb',
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return constructMetadata({
      title: 'Produto não encontrado',
      description: 'O produto solicitado não está disponível no catálogo.',
    });
  }

  return constructMetadata({
    title: product.title,
    description: product.description || product.subtitle || 'Peça autoral exclusiva Neruma Design Orgânico.',
    path: `/produto/${handle}`,
    image: product.thumbnail || '/og-default.jpg',
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Verificar se há modelo 3D cadastrado para este produto
  const modelUrl = PRODUCT_3D_MODELS[handle] || null;

  const metadata: any = product.metadata || {};
  const dimensions = metadata.dimensions;
  const shippingMeta = metadata.shipping;

  const defaultVariant = product.variants?.[0];
  const priceInCents =
    defaultVariant?.calculated_price?.calculated_amount || 0;

  // Formatação segura no Server Component
  const formattedPrice = formatBRL(priceInCents, true);
  const formattedDimensions = dimensions
    ? formatDimensions(dimensions.width_mm, dimensions.height_mm, dimensions.depth_mm)
    : null;
  const formattedWeight = shippingMeta?.weight_g
    ? formatWeight(shippingMeta.weight_g)
    : null;

  return (
    <>
      {/* Microdados SEO Schema.org */}
      <ProductJsonLd
        name={product.title}
        description={product.description || ''}
        images={product.thumbnail ? [product.thumbnail] : []}
        price={priceInCents}
        sku={defaultVariant?.sku ?? undefined}
        url={`https://neruma.com.br/produto/${handle}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', url: 'https://neruma.com.br' },
          { name: 'Catálogo', url: 'https://neruma.com.br/produtos' },
          { name: product.title, url: `https://neruma.com.br/produto/${handle}` },
        ]}
      />

      {/* Todo o catálogo unificado no padrão Landing Page Imersiva Dark */}
      <ProductImmersivePDP
        product={product}
        handle={handle}
        modelUrl={modelUrl}
        formattedPrice={formattedPrice}
        formattedDimensions={formattedDimensions}
        formattedWeight={formattedWeight}
      />
    </>
  );
}
