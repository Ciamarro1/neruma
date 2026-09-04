import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container';
import { getStories } from '../../../lib/payload/client';
import { constructMetadata } from '../../../lib/seo/metadata';
import { ArrowRight } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Histórias de Criação & Revista Editorial',
  description:
    'Artigos sobre design biofílico, processos de marcenaria fina, manejo de freijó e cultivo de sisal.',
  path: '/historias',
});

export const revalidate = 300;

export default async function StoriesPage() {
  const stories = await getStories(20);

  return (
    <div className="py-12 pb-24">
      <Container size="lg">
        <div className="border-b border-neruma-border pb-8 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood block mb-2">
            Revista Neruma
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neruma-dark">
            Histórias de Criação
          </h1>
          <p className="text-sm text-neruma-muted mt-2">
            Conheça o tempo, os mestres artesãos e os conceitos orgânicos por trás de cada obra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stories.length > 0 ? (
            stories.map((story: any) => (
              <Link key={story.id} href={`/historias/${story.slug}`} className="group block">
                <div className="relative aspect-[16/11] bg-neruma-sand-100 rounded-neruma overflow-hidden mb-4 border border-neruma-border">
                  {story.coverImage?.url ? (
                    <Image
                      src={story.coverImage.url}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}
                </div>
                <span className="text-[11px] uppercase tracking-wider text-neruma-muted">
                  {story.author || 'Ateliê Neruma'} • {story.readingTimeMinutes || 4} min de leitura
                </span>
                <h3 className="font-serif text-2xl font-medium text-neruma-dark group-hover:text-neruma-wood transition-colors mt-1 mb-2">
                  {story.title}
                </h3>
                <p className="text-xs text-neruma-muted line-clamp-3 leading-relaxed">
                  {story.excerpt}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 text-neruma-muted">
              <p>Nenhuma história publicada no momento.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
