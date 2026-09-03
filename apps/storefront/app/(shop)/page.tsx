import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../components/ui/Container.js';
import { Button } from '../../components/ui/Button.js';
import { ProductCard } from '../../components/product/ProductCard.js';
import { LookbookScene } from '../../components/editorial/LookbookScene.js';
import { getProducts } from '../../lib/medusa/products.js';
import { getEditorialCollections, getLookbooks, getStories } from '../../lib/payload/client.js';
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react';

export const revalidate = 300; // ISR a cada 5 minutos

export default async function HomePage() {
  const [products, collections, lookbooks, stories] = await Promise.all([
    getProducts({ limit: 8 }),
    getEditorialCollections(),
    getLookbooks(),
    getStories(3),
  ]);

  const featuredCollection = collections[0];
  const featuredLookbook = lookbooks[0];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO EDITORIAL */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-neruma-dark/30 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
          alt="Ambiente Orgânico com Madeira e Fibras Naturais"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative z-20 max-w-3xl px-4 text-white space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-neruma-sand-200">
            Coleção Raízes 2026
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            A nobreza da madeira. A alma das fibras.
          </h1>
          <p className="text-base sm:text-lg text-neruma-sand-100 max-w-xl mx-auto leading-relaxed">
            Obras autorais e peças de mobiliário biofílico que trazem a natureza para dentro do seu lar.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/produtos">
              <Button size="lg" className="w-full sm:w-auto bg-neruma-sand-100 text-neruma-dark hover:bg-white">
                Explorar Catálogo
              </Button>
            </Link>
            <Link href="/lookbooks">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                Ver Lookbooks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS DE DESTAQUE */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-neruma-dark mb-3">Categorias em Foco</h2>
            <p className="text-sm text-neruma-muted">Design pensado para equilibrar estética atemporal, acolhimento e funcionalidade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/categorias/quadros-e-paineis" className="group block relative aspect-[4/5] rounded-neruma overflow-hidden border border-neruma-border">
              <Image
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop"
                alt="Quadros e Painéis Botânicos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neruma-dark/80 via-neruma-dark/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neruma-sand-200 mb-1">Madeira & Tela</span>
                <h3 className="font-serif text-2xl font-bold">Quadros & Painéis</h3>
              </div>
            </Link>

            <Link href="/categorias/luminarias-organicas" className="group block relative aspect-[4/5] rounded-neruma overflow-hidden border border-neruma-border">
              <Image
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop"
                alt="Luminárias Orgânicas"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neruma-dark/80 via-neruma-dark/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neruma-sand-200 mb-1">Fibras & Luz</span>
                <h3 className="font-serif text-2xl font-bold">Luminárias em Fibras</h3>
              </div>
            </Link>

            <Link href="/categorias/mobiliario-pet" className="group block relative aspect-[4/5] rounded-neruma overflow-hidden border border-neruma-border">
              <Image
                src="https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=1000&auto=format&fit=crop"
                alt="Linha Pet Japandi"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neruma-dark/80 via-neruma-dark/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neruma-sand-200 mb-1">Arranhadores & Camas</span>
                <h3 className="font-serif text-2xl font-bold">Mobiliário Pet Japandi</h3>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. LANÇAMENTOS DO CATÁLOGO MEDUSA */}
      <section className="bg-neruma-sand-100 py-20 border-y border-neruma-border">
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood mb-2 block">
                Ateliê Neruma
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neruma-dark">
                Peças em Destaque
              </h2>
            </div>
            <Link href="/produtos" className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold uppercase tracking-wider text-neruma-dark hover:text-neruma-wood">
              Ver Catálogo Completo <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center py-12 text-sm text-neruma-muted">
                Nenhum produto cadastrado no catálogo Medusa no momento.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* 4. LOOKBOOK INTERATIVO (PAYLOAD + MEDUSA HOTSPOTS) */}
      {featuredLookbook ? (
        <section>
          <Container size="lg">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest font-semibold text-neruma-terracotta mb-2 block">
                Shop the Look
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neruma-dark mb-3">
                {featuredLookbook.title}
              </h2>
              <p className="text-sm text-neruma-muted">
                Toque nos pontos da imagem para descobrir as peças e materiais que compõem este espaço.
              </p>
            </div>

            <LookbookScene
              title={featuredLookbook.title}
              sceneImageUrl={featuredLookbook.sceneImage?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600'}
              hotspots={featuredLookbook.hotspots || []}
            />
          </Container>
        </section>
      ) : null}

      {/* 5. HISTÓRIAS & EDITORIAL PAYLOAD */}
      {stories.length > 0 ? (
        <section>
          <Container size="lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood mb-2 block">
                  Revista & Inspiração
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neruma-dark">
                  Histórias de Criação
                </h2>
              </div>
              <Link href="/historias" className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold uppercase tracking-wider text-neruma-dark hover:text-neruma-wood">
                Ver Todas as Histórias <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.map((story: any) => (
                <Link key={story.id} href={`/historias/${story.slug}`} className="group block">
                  <div className="relative aspect-[16/10] bg-neruma-sand-100 rounded-neruma overflow-hidden mb-4 border border-neruma-border">
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
                  <h3 className="font-serif text-xl font-medium text-neruma-dark group-hover:text-neruma-wood transition-colors mt-1 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neruma-muted line-clamp-2 leading-relaxed">
                    {story.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
