import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '../../../../components/ui/Container';
import { LookbookScene } from '../../../../components/editorial/LookbookScene';
import { getLookbookBySlug } from '../../../../lib/payload/client';
import { constructMetadata } from '../../../../lib/seo/metadata';

interface LookbookDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LookbookDetailPageProps) {
  const { slug } = await params;
  const lookbook = await getLookbookBySlug(slug);

  if (!lookbook) {
    return constructMetadata({
      title: 'Lookbook não encontrado',
      description: 'O lookbook solicitado não existe.',
    });
  }

  return constructMetadata({
    title: lookbook.title,
    description: lookbook.description || 'Explore o ambiente e compre as peças autorais Neruma.',
    path: `/lookbooks/${slug}`,
    image: lookbook.sceneImage?.url,
  });
}

export default async function LookbookDetailPage({ params }: LookbookDetailPageProps) {
  const { slug } = await params;
  const lookbook = await getLookbookBySlug(slug);

  if (!lookbook) {
    notFound();
  }

  return (
    <div className="py-12 pb-24">
      <Container size="lg">
        {/* Breadcrumb */}
        <nav className="text-xs text-neruma-muted uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-neruma-dark">Início</Link>
          <span className="mx-2">/</span>
          <Link href="/lookbooks" className="hover:text-neruma-dark">Lookbooks</Link>
          <span className="mx-2">/</span>
          <span className="text-neruma-dark font-medium">{lookbook.title}</span>
        </nav>

        <div className="max-w-3xl mb-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-neruma-terracotta block mb-2">
            Ambiente & Composição
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neruma-dark mb-4">
            {lookbook.title}
          </h1>
          {lookbook.description ? (
            <p className="text-sm text-neruma-muted leading-relaxed">
              {lookbook.description}
            </p>
          ) : null}
        </div>

        {/* Cena Interativa */}
        <LookbookScene
          title={lookbook.title}
          sceneImageUrl={lookbook.sceneImage?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600'}
          hotspots={lookbook.hotspots || []}
        />
      </Container>
    </div>
  );
}
