import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container';
import { getStories } from '../../../lib/payload/client';
import { constructMetadata } from '../../../lib/seo/metadata';

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
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        <div className="border-b border-white/10 pb-10 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Revista Neruma
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Histórias de Criação
          </h1>
          <p className="text-sm text-neruma-sand-400/80 mt-2.5 font-light leading-relaxed">
            Conheça o tempo, os mestres artesãos e os conceitos orgânicos por trás de cada obra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stories.length > 0 ? (
            stories.map((story: any) => (
              <Link key={story.id} href={`/historias/${story.slug}`} className="group block">
                <div className="relative aspect-[16/11] bg-[#1A1816] rounded-organic overflow-hidden mb-4 border border-white/10 group-hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-2xl shadow-black/60">
                  {story.coverImage?.url ? (
                    <Image
                      src={story.coverImage.url}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                  ) : null}
                </div>
                <span className="text-[11px] uppercase tracking-wider text-neruma-sand-400/70 font-light">
                  {story.author || 'Ateliê Neruma'} • {story.readingTimeMinutes || 4} min de leitura
                </span>
                <h3 className="font-serif text-2xl font-medium text-white group-hover:text-neruma-sand-200 transition-colors mt-1 mb-2">
                  {story.title}
                </h3>
                <p className="text-xs text-neruma-sand-400/80 line-clamp-3 leading-relaxed font-light">
                  {story.excerpt}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 text-neruma-sand-400/60 font-light">
              <p>Nenhuma história publicada no momento.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
