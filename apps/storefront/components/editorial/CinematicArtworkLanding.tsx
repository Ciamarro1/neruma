'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CinematicArtworkConfig } from '@neruma/types';
import { CinematicArtworkCanvas } from './CinematicArtworkCanvas';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Check,
  Ruler,
  Clock,
  Layers,
} from 'lucide-react';

interface CinematicArtworkLandingProps {
  config: CinematicArtworkConfig;
  product: {
    id?: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    variants?: Array<{
      id?: string;
      sku?: string | null;
      calculated_price?: {
        calculated_amount?: number;
      };
    }>;
    metadata?: Record<string, any>;
  };
  handle: string;
  formattedPrice: string;
  formattedDimensions: string | null;
  formattedWeight: string | null;
}

export function CinematicArtworkLanding({
  config,
  product,
  handle,
  formattedPrice,
  formattedDimensions,
  formattedWeight,
}: CinematicArtworkLandingProps) {
  const { addItem } = useCart();
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Monitorar qual seção está visível no viewport para guiar a câmera do Canvas
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      let currentIndex = 0;
      sectionRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Quando a seção cruza o terço superior da tela
        if (rect.top <= viewportHeight * 0.4) {
          currentIndex = index;
        }
      });

      setActiveActIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.calculated_price?.calculated_amount || 92000;
    addItem(
      {
        id: product.id || handle,
        title: product.title,
        handle,
        thumbnail: config.artwork_asset_url,
        variantId: defaultVariant?.id,
        price,
      },
      1
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  const scrollToAct = (index: number) => {
    const target = sectionRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#12100E] text-neruma-sand-100 min-h-screen selection:bg-neruma-terracotta selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header / HUD Superior Minimalista de Galeria                */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-[#12100E]/70 border-b border-white/5 transition-all">
        <div className="flex items-center gap-3">
          <Link
            href="/produtos"
            className="text-xs uppercase tracking-widest text-neruma-sand-300 hover:text-white transition-colors"
          >
            ← Voltar ao Catálogo
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-xs text-neruma-sand-400 hidden sm:inline">
            Curadoria Autoral Neruma
          </span>
        </div>

        {/* Indicador de Ato Atual */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-neruma-sand-400">
            Ato 0{activeActIndex + 1} / 0{config.acts.length}
          </span>
          <div className="flex gap-1">
            {config.acts.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToAct(i)}
                aria-label={`Ir para ato ${i + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === activeActIndex
                    ? 'w-6 bg-neruma-terracotta-light'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mini CTA Superior */}
        <div>
          <button
            onClick={() => scrollToAct(config.acts.length - 1)}
            className="text-xs uppercase tracking-widest font-medium text-neruma-terracotta-light hover:text-white transition-colors"
          >
            Adquirir Obra
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. Canvas Fixo de Fundo (Engine Cinematográfica 1:1)           */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CinematicArtworkCanvas
          artworkUrl={config.artwork_asset_url}
          aspectRatio={config.aspect_ratio}
          waypoints={config.waypoints}
          activeActIndex={activeActIndex}
          progressInAct={0.5}
          altText={product.title}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Seções Narrativas em Scroll (8 Atos)                        */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-10">
        {config.acts.map((act, index) => {
          const isCurrent = activeActIndex === index;
          const isFinalAct = index === config.acts.length - 1;

          return (
            <section
              key={act.act_number}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="min-h-screen flex flex-col justify-center px-6 lg:px-20 py-24 pointer-events-none"
            >
              <div
                className={`max-w-xl transition-all duration-700 ease-out pointer-events-auto ${
                  isCurrent
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-25 translate-y-6'
                } ${
                  // Alternar alinhamento visual para dinâmica editorial
                  index % 2 === 0
                    ? 'mr-auto text-left'
                    : 'ml-auto text-left lg:text-right'
                }`}
              >
                {/* Cartão Editorial Translúcido */}
                <div className="p-8 lg:p-10 rounded-organic backdrop-blur-xl bg-[#141210]/80 border border-white/10 shadow-2xl space-y-5">
                  {/* Badge de Ato */}
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neruma-terracotta" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neruma-sand-300 font-sans">
                      {act.subtitle || `Ato 0${act.act_number}`}
                    </span>
                  </div>

                  {/* Título Poético */}
                  <h2 className="font-serif text-3xl lg:text-4xl text-white font-normal leading-tight tracking-tight">
                    {act.title}
                  </h2>

                  {/* Prosa Editorial */}
                  <p className="font-sans text-sm lg:text-base text-neruma-sand-200 leading-relaxed font-light">
                    {act.prose}
                  </p>

                  {/* Destaque Factual de Materiais / BOM (Ato 4) */}
                  {act.highlight_facts && act.highlight_facts.length > 0 && (
                    <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {act.highlight_facts.map((fact, fIdx) => (
                        <div key={fIdx} className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-neruma-sand-400 block">
                            {fact.label}
                          </span>
                          <span className="text-xs font-medium text-white block">
                            {fact.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Citação do Ateliê (Ato 6) */}
                  {act.quote && (
                    <blockquote className="pt-4 border-t border-white/10 italic text-neruma-sand-100 text-sm">
                      “{act.quote.text}”
                      <footer className="mt-2 not-italic text-xs font-sans tracking-wide text-neruma-terracotta-light">
                        — {act.quote.author}{' '}
                        {act.quote.role ? `(${act.quote.role})` : ''}
                      </footer>
                    </blockquote>
                  )}

                  {/* Último Ato: Checkout Comercial Integrado Medusa v2 */}
                  {isFinalAct && (
                    <div className="pt-6 border-t border-white/10 space-y-6">
                      <div className="flex items-baseline justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-neruma-sand-400 block">
                            Valor de Aquisição Autoral
                          </span>
                          <span className="font-serif text-3xl text-white font-semibold">
                            {formattedPrice}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-[11px] text-neruma-olive-light bg-neruma-olive-dark/40 px-2 py-0.5 rounded border border-neruma-olive-light/30">
                            5% OFF via Pix
                          </span>
                          <span className="text-xs text-neruma-sand-300 block mt-1">
                            ou até 10x sem juros no cartão
                          </span>
                        </div>
                      </div>

                      {/* Especificações Rápidas de Galeria */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-neruma-sand-300 bg-white/5 p-3 rounded-neruma border border-white/5">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-3.5 h-3.5 text-neruma-terracotta-light" />
                          <span>{formattedDimensions || '60 × 80 × 5 cm'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-neruma-terracotta-light" />
                          <span>{formattedWeight || '3,8 kg (com moldura)'}</span>
                        </div>
                      </div>

                      {/* Botão de Adição à Sacola */}
                      <Button
                        size="lg"
                        variant="primary"
                        className="w-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-sans py-4 shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
                        onClick={handleAddToCart}
                        disabled={isAdded}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            Obra Adicionada à Sacola
                          </>
                        ) : (
                          <>
                            Adicionar à Sacola • {formattedPrice}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>

                      {/* Garantias & Envio Factual */}
                      <div className="flex items-center justify-between text-[11px] text-neruma-sand-300 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-neruma-terracotta-light" />
                          <span>Envio Rígido Antichoque</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-neruma-olive-light" />
                          <span>Certificado de Autenticidade</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dica de Scroll no Ato 1 */}
                  {index === 0 && (
                    <div className="pt-2 flex items-center gap-2 text-xs text-neruma-sand-300 animate-pulse">
                      <ChevronDown className="w-4 h-4" />
                      <span>Role para explorar os detalhes da obra</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 4. Barra Flutuante de Curadoria (Rodapé Sutil)                 */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-20 py-8 px-6 text-center border-t border-white/5 bg-[#12100E] text-xs text-neruma-sand-400">
        <p>
          {config.curator_note ||
            'Neruma — Design Orgânico, Arquitetura Biofílica & Arte Autoral.'}
        </p>
      </footer>
    </div>
  );
}
