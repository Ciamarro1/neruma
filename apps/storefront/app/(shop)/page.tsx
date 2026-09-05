import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { ProductCard } from '../../components/product/ProductCard';
import { LookbookScene } from '../../components/editorial/LookbookScene';
import { getProducts } from '../../lib/medusa/products';
import { getEditorialCollections, getLookbooks, getStories } from '../../lib/payload/client';
import { ArrowRight, Sparkles, Box } from 'lucide-react';

export const revalidate = 300; // ISR a cada 5 minutos

export default async function HomePage() {
  const [products, collections, lookbooks, stories] = await Promise.all([
    getProducts({ limit: 8 }),
    getEditorialCollections(),
    getLookbooks(),
    getStories(3),
  ]);

  const featuredLookbook = lookbooks[0];

  return (
    <div className="space-y-28 pb-28 bg-[#141210] text-neruma-sand-100">
      {/* 1. HERO EDITORIAL DARK */}
      <section className="relative h-[90vh] min-h-[640px] flex items-center justify-center text-center overflow-hidden">
        {/* Camada escura de imersão */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/60 to-black/40 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
          alt="Ambiente Orgânico com Madeira e Fibras Naturais"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 animate-fade-in"
        />

        <div className="relative z-20 max-w-3xl px-4 text-white space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] uppercase tracking-[0.25em] font-medium text-neruma-sand-200">
            <Sparkles className="w-3.5 h-3.5 text-neruma-terracotta-light" />
            Coleção Raízes 2026
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            A nobreza da madeira. <br className="hidden sm:inline" />
            A alma das fibras.
          </h1>

          <p className="text-base sm:text-lg text-neruma-sand-200/90 max-w-xl mx-auto leading-relaxed font-light">
            Obras autorais e peças de mobiliário biofílico com visualização 3D interativa que trazem a natureza para dentro do seu lar.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/produtos">
              <Button size="lg" className="w-full sm:w-auto bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white px-8 shadow-lg shadow-neruma-terracotta/30">
                Explorar Catálogo
              </Button>
            </Link>
            <Link href="/produto/luminaria-pendente-macrame-ninho">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 flex items-center gap-2 backdrop-blur-md">
                <Box className="w-4 h-4 text-neruma-terracotta-light" />
                Experiência 3D Interativa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS DE DESTAQUE */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neruma-terracotta-light font-semibold">
              Acervo Autoral
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
              Categorias em Foco
            </h2>
            <p className="text-sm text-neruma-sand-400/80 font-light">
              Design pensado para equilibrar estética atemporal, acolhimento e funcionalidade biofílica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Categoria 1 */}
            <Link href="/categorias/quadros-e-paineis" className="group block relative aspect-[4/5] rounded-organic overflow-hidden border border-white/10 hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-2xl shadow-black/60">
              <Image
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop"
                alt="Quadros e Painéis Botânicos"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neruma-terracotta-light mb-1 font-semibold">Madeira & Tela</span>
                <h3 className="font-serif text-2xl font-bold">Quadros & Painéis</h3>
                <p className="text-xs text-neruma-sand-300/70 mt-1 font-light flex items-center gap-1 group-hover:text-white transition-colors">
                  Ver peças <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>

            {/* Categoria 2 */}
            <Link href="/categorias/luminarias-organicas" className="group block relative aspect-[4/5] rounded-organic overflow-hidden border border-white/10 hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-2xl shadow-black/60">
              <Image
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop"
                alt="Luminárias Orgânicas"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neruma-terracotta-light mb-1 font-semibold">Fibras & Luz</span>
                <h3 className="font-serif text-2xl font-bold">Luminárias em Fibras</h3>
                <p className="text-xs text-neruma-sand-300/70 mt-1 font-light flex items-center gap-1 group-hover:text-white transition-colors">
                  Ver modelos com 3D <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>

            {/* Categoria 3 */}
            <Link href="/categorias/mobiliario-pet" className="group block relative aspect-[4/5] rounded-organic overflow-hidden border border-white/10 hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-2xl shadow-black/60">
              <Image
                src="https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=1000&auto=format&fit=crop"
                alt="Linha Pet Japandi"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neruma-terracotta-light mb-1 font-semibold">Arranhadores & Camas</span>
                <h3 className="font-serif text-2xl font-bold">Mobiliário Pet Japandi</h3>
                <p className="text-xs text-neruma-sand-300/70 mt-1 font-light flex items-center gap-1 group-hover:text-white transition-colors">
                  Ver peças <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. LANÇAMENTOS DO CATÁLOGO MEDUSA */}
      <section className="bg-[#181614] py-24 border-y border-white/5">
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light mb-2 block">
                Ateliê Neruma
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Peças em Destaque
              </h2>
            </div>
            <Link
              href="/produtos"
              className="mt-4 md:mt-0 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-neruma-sand-300 hover:text-white transition-colors"
            >
              Ver Catálogo Completo <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-3 text-center py-12 text-sm text-neruma-sand-400">
                Carregando acervo autoral...
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* 4. LOOKBOOK INTERATIVO (PAYLOAD + MEDUSA HOTSPOTS) */}
      {featuredLookbook ? (
        <section>
          <Container size="lg">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light mb-2 block">
                Shop the Look
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
                {featuredLookbook.title}
              </h2>
              <p className="text-sm text-neruma-sand-400/80 font-light">
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

      {/* 5. HISTÓRIAS & EDITORIAL */}
      {stories.length > 0 ? (
        <section className="bg-[#181614] py-24 border-t border-white/5">
          <Container size="lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light mb-2 block">
                  Revista & Inspiração
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  Histórias de Criação
                </h2>
              </div>
              <Link
                href="/historias"
                className="mt-4 md:mt-0 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-neruma-sand-300 hover:text-white transition-colors"
              >
                Ver Todas as Histórias <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.map((story: any) => (
                <Link key={story.id} href={`/historias/${story.slug}`} className="group block">
                  <div className="relative aspect-[16/10] bg-[#1A1816] rounded-organic overflow-hidden mb-4 border border-white/10 group-hover:border-neruma-terracotta-light/40 transition-all duration-500 shadow-xl shadow-black/50">
                    {story.coverImage?.url ? (
                      <Image
                        src={story.coverImage.url}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                      />
                    ) : null}
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-neruma-sand-400/70 font-light">
                    {story.author || 'Ateliê Neruma'} • {story.readingTimeMinutes || 4} min de leitura
                  </span>
                  <h3 className="font-serif text-xl font-medium text-white group-hover:text-neruma-sand-200 transition-colors mt-1 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neruma-sand-400/80 line-clamp-2 leading-relaxed font-light">
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
