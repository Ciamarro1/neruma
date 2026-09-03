import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container.js';
import { getLookbooks } from '../../../lib/payload/client.js';
import { constructMetadata } from '../../../lib/seo/metadata.js';
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
    <div className="py-12 pb-24">
      <Container size="lg">
        <div className="border-b border-neruma-border pb-8 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-neruma-terracotta block mb-2">
            Editorial & Espaço
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neruma-dark">
            Lookbooks Interativos
          </h1>
          <p className="text-sm text-neruma-muted mt-2">
            Explore cenários reais harmonizados por arquitetos e toque nos hotspots para comprar o look.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {lookbooks.length > 0 ? (
            lookbooks.map((lb: any) => (
              <Link key={lb.id} href={`/lookbooks/${lb.slug}`} className="group block">
                <div className="relative aspect-[16/10] bg-neruma-sand-100 rounded-organic overflow-hidden mb-4 border border-neruma-border shadow-organic">
                  {lb.sceneImage?.url ? (
                    <Image
                      src={lb.sceneImage.url}
                      alt={lb.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : null}
                  <div className="absolute top-4 right-4 bg-neruma-dark/80 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                    {lb.hotspots?.length || 0} Peças no Look
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-neruma-dark group-hover:text-neruma-wood transition-colors">
                  {lb.title}
                </h3>
                <p className="text-xs text-neruma-muted mt-1 flex items-center">
                  Explorar Ambiente Interativo <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 text-neruma-muted">
              <p>Nenhum lookbook publicado no momento.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
