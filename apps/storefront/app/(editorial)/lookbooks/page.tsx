import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container';
import { getLookbooks } from '../../../lib/payload/client';
import { constructMetadata } from '../../../lib/seo/metadata';
import { ArrowRight } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Lookbooks Interativos — Inspiração & Shop the Look',
  description:
    'Composições completas de salas, quartos e ambientes biofílicos com marcações interativas para comprar as peças.',
  path: '/lookbooks',
});

export const revalidate = 300;

export default async function LookbooksPage() {
  const lookbooks = await getLookbooks();

  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        <div className="border-b border-white/10 pb-10 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Editorial & Ambientes
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Lookbooks Interativos
          </h1>
          <p className="text-sm text-neruma-sand-400/80 mt-2.5 font-light leading-relaxed">
            Explore cenários reais harmonizados por arquitetos e toque nos hotspots para descobrir cada criação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {lookbooks.length > 0 ? (
            lookbooks.map((lb: any) => (
              <Link key={lb.id} href={`/lookbooks/${lb.slug}`} className="group block">
                <div className="relative aspect-[16/10] bg-[#1A1816] rounded-organic overflow-hidden mb-4 border border-white/10 group-hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-2xl shadow-black/60">
                  {lb.sceneImage?.url ? (
                    <Image
                      src={lb.sceneImage.url}
                      alt={lb.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                  ) : null}
                  <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md text-white text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-white/10">
                    {lb.hotspots?.length || 0} Peças no Look
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-neruma-sand-200 transition-colors">
                  {lb.title}
                </h3>
                <p className="text-xs text-neruma-terracotta-light mt-1.5 flex items-center gap-1 font-medium">
                  Explorar Ambiente Interativo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 text-neruma-sand-400/60 font-light">
              <p>Nenhum lookbook publicado no momento.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
