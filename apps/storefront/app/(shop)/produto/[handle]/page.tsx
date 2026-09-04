import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../../../../components/ui/Container';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { ProductJsonLd, BreadcrumbJsonLd } from '../../../../lib/seo/jsonld';
import { constructMetadata } from '../../../../lib/seo/metadata';
import { formatBRL, formatDimensions, formatWeight } from '../../../../lib/utils/formatters';
import { getProductByHandle, getProducts } from '../../../../lib/medusa/products';
import { ShieldCheck, Truck, Sparkles, Ruler, Leaf, RefreshCw } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

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
    description: product.description || product.subtitle || 'Peça artesanal exclusiva Neruma.',
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

  const metadata: any = product.metadata || {};
  const dimensions = metadata.dimensions;
  const shippingMeta = metadata.shipping;
  const design = metadata.design;
  const sustainability = metadata.sustainability;
  const manufacturing = metadata.manufacturing;

  const defaultVariant = product.variants?.[0];
  const priceInCents =
    defaultVariant?.calculated_price?.calculated_amount ||
    0;

  return (
    <div className="py-12 pb-24">
      {/* SEO JSON-LD */}
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

      <Container size="lg">
        {/* Breadcrumb Visual */}
        <nav className="text-xs text-neruma-muted uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-neruma-dark">Início</Link>
          <span className="mx-2">/</span>
          <Link href="/produtos" className="hover:text-neruma-dark">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-neruma-dark font-medium">{product.title}</span>
        </nav>

        {/* Grade Principal: Galeria + Detalhes Comerciais */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Coluna da Imagem / Galeria */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] bg-neruma-sand-100 rounded-neruma overflow-hidden border border-neruma-border shadow-card">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neruma-muted uppercase tracking-widest text-xs">
                  Sem Imagem
                </div>
              )}

              {metadata.merchandising?.badge ? (
                <div className="absolute top-4 left-4">
                  <Badge variant="wood">{metadata.merchandising.badge}</Badge>
                </div>
              ) : null}
            </div>
          </div>

          {/* Coluna de Informações Comerciais & Compra */}
          <div className="lg:col-span-5 space-y-6">
            {design?.materials?.[0] ? (
              <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood">
                {design.materials[0].replace(/_/g, ' ')}
              </span>
            ) : null}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neruma-dark">
              {product.title}
            </h1>

            {product.subtitle ? (
              <p className="text-sm text-neruma-muted leading-relaxed">
                {product.subtitle}
              </p>
            ) : null}

            {/* Preço em BRL (Calculado pelo Medusa) */}
            <div className="pt-2 border-t border-neruma-border">
              <span className="text-2xl font-bold text-neruma-dark">
                {formatBRL(priceInCents, true)}
              </span>
              <span className="block text-xs text-neruma-muted mt-1">
                em até 10x sem juros no cartão ou com 5% de desconto no Pix
              </span>
            </div>

            {/* Especificações Rápidas */}
            {dimensions ? (
              <div className="flex items-center space-x-6 py-4 px-4 bg-neruma-sand-100 rounded-neruma border border-neruma-border text-xs text-neruma-charcoal">
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-neruma-wood" />
                  <span>{formatDimensions(dimensions.width_mm, dimensions.height_mm, dimensions.depth_mm)}</span>
                </div>
                {shippingMeta?.weight_g ? (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-neruma-wood" />
                    <span>{formatWeight(shippingMeta.weight_g)}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Ação de Compra */}
            <div className="pt-4 space-y-3">
              <Button size="lg" className="w-full bg-neruma-dark hover:bg-neruma-wood-dark text-white">
                Adicionar à Sacola
              </Button>
              <p className="text-[11px] text-center text-neruma-muted">
                ⚡ Peça artesanal sob encomenda: prazo de produção de {manufacturing?.production_time_hours ? `${Math.round(manufacturing.production_time_hours)}h` : '5 a 8 dias úteis'}.
              </p>
            </div>

            {/* Benefícios e Segurança */}
            <div className="pt-6 border-t border-neruma-border space-y-3 text-xs text-neruma-muted">
              <div className="flex items-center space-x-3">
                <Truck className="w-4 h-4 text-neruma-wood" />
                <span>Cálculo de frete em tempo real no checkout via Correios e Jadlog</span>
              </div>
              <div className="flex items-center space-x-3">
                <Leaf className="w-4 h-4 text-neruma-olive" />
                <span>Madeira com certificação de sustentabilidade e embalagem 100% livre de plástico</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-neruma-wood" />
                <span>Garantia de 1 ano contra defeitos de fabricação</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Storytelling & Detalhes Artesanais */}
        <div className="mt-20 pt-16 border-t border-neruma-border grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood mb-2 block">
              A Obra & Conceito
            </span>
            <h3 className="font-serif text-2xl font-bold text-neruma-dark mb-4">
              História e Processo Criativo
            </h3>
            <div className="text-sm text-neruma-muted space-y-4 leading-relaxed">
              <p>{product.description}</p>
              {manufacturing?.artisan_name ? (
                <p className="pt-2 italic">
                  Concebido e esculpido por: <strong className="text-neruma-dark font-medium not-italic">{manufacturing.artisan_name}</strong> ({manufacturing.workshop_location || 'Brasil'}).
                </p>
              ) : null}
            </div>
          </div>

          <div className="bg-neruma-sand-100 p-8 rounded-neruma border border-neruma-border space-y-4">
            <h4 className="font-serif text-lg font-bold text-neruma-dark">
              Especificações Técnicas
            </h4>
            <dl className="text-xs divide-y divide-neruma-border">
              <div className="py-2 flex justify-between">
                <dt className="text-neruma-muted">Materiais Utilizados:</dt>
                <dd className="font-medium text-neruma-dark text-right">
                  {design?.materials?.map((m: string) => m.replace(/_/g, ' ')).join(', ') || 'Madeira nobre'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-neruma-muted">Estilo Predominante:</dt>
                <dd className="font-medium text-neruma-dark text-right">
                  {design?.styles?.map((s: string) => s.replace(/_/g, ' ')).join(', ') || 'Orgânico'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-neruma-muted">Ambientes Recomendados:</dt>
                <dd className="font-medium text-neruma-dark text-right">
                  {design?.rooms?.map((r: string) => r.replace(/_/g, ' ')).join(', ') || 'Sala, Quarto'}
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-neruma-muted">Acabamento:</dt>
                <dd className="font-medium text-neruma-dark text-right">
                  {design?.finishes?.map((f: string) => f.replace(/_/g, ' ')).join(', ') || 'Óleo mineral atóxico'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </div>
  );
}
