import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../../../../components/ui/Container';
import { ProductCard } from '../../../../components/product/ProductCard';
import { getStoryBySlug } from '../../../../lib/payload/client';
import { getProductByHandle } from '../../../../lib/medusa/products';
import { constructMetadata } from '../../../../lib/seo/metadata';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return constructMetadata({
      title: 'Artigo não encontrado',
      description: 'A história solicitada não existe.',
    });
  }

  return constructMetadata({
    title: story.title,
    description: story.excerpt || 'Artigo editorial Neruma.',
    path: `/historias/${slug}`,
    image: story.coverImage?.url,
    type: 'article',
  });
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // Busca produtos do Medusa vinculados a este artigo
  const relatedHandles = story.relatedProductHandles?.map((item: any) => item.handle) || [];
  const relatedProducts = await Promise.all(
    relatedHandles.map((handle: string) => getProductByHandle(handle))
  );
  const validProducts = relatedProducts.filter(Boolean);

  return (
    <article className="py-12 pb-24">
      <Container size="sm">
        {/* Breadcrumb */}
        <nav className="text-xs text-neruma-muted uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-neruma-dark">Início</Link>
          <span className="mx-2">/</span>
          <Link href="/historias" className="hover:text-neruma-dark">Histórias</Link>
          <span className="mx-2">/</span>
          <span className="text-neruma-dark font-medium">{story.title}</span>
        </nav>

        {/* Cabeçalho do Artigo */}
        <header className="space-y-4 mb-10 text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood">
            {story.author || 'Ateliê Neruma'} • {story.readingTimeMinutes || 4} min de leitura
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neruma-dark leading-tight">
            {story.title}
          </h1>
          <p className="text-base text-neruma-muted max-w-xl mx-auto leading-relaxed">
            {story.excerpt}
          </p>
        </header>

        {/* Imagem de Capa */}
        {story.coverImage?.url ? (
          <div className="relative aspect-[16/10] bg-neruma-sand-100 rounded-neruma overflow-hidden mb-12 border border-neruma-border shadow-card">
            <Image
              src={story.coverImage.url}
              alt={story.title}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        ) : null}

        {/* Corpo do Artigo */}
        <div className="prose prose-neruma max-w-none text-neruma-charcoal text-base leading-relaxed space-y-6">
          <p>
            {story.excerpt}
          </p>
        </div>

        {/* Produtos Medusa em Destaque nesta História */}
        {validProducts.length > 0 ? (
          <div className="mt-16 pt-12 border-t border-neruma-border">
            <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood block mb-2">
              Peças em Destaque
            </span>
            <h3 className="font-serif text-2xl font-bold text-neruma-dark mb-6">
              Obras Citadas neste Artigo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {validProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </article>
  );
}
