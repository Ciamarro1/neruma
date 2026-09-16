'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';

interface ParallaxHeroProps {
  eyebrow: string;
  giantWord: string;
  title: ReactNode;
  subtitle: string;
  backgroundSrc: string;
  backgroundAlt: string;
  children?: ReactNode;
}

/**
 * ParallaxHero — estilo HEAVN One / Multi-Layered Depth.
 * Estrutura: container alto (220vh) + conteúdo sticky (100vh) com 3 camadas:
 *  - Camada 0 (fundo): imagem, move lento + zoom-out no scroll
 *  - Camada 1 (meio): tipografia gigante vazada, move rápido (depth)
 *  - Camada 2 (frente): conteúdo + CTAs, move médio + fade-out
 */
export function ParallaxHero({
  eyebrow,
  giantWord,
  title,
  subtitle,
  backgroundSrc,
  backgroundAlt,
  children,
}: ParallaxHeroProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progresso 0 (hero entrando) → 1 (hero saindo por cima)
      const total = rect.height - vh;
      const raw = total > 0 ? -rect.top / total : 0;
      const p = Math.min(1, Math.max(0, raw));

      if (bgRef.current) {
        // fundo: desce devagar + perde zoom
        bgRef.current.style.transform = `translate3d(0, ${(p * 140).toFixed(1)}px, 0) scale(${(1.15 - p * 0.12).toFixed(3)})`;
      }
      if (giantRef.current) {
        // palavra gigante: sobe rápido (foreground da depth)
        giantRef.current.style.transform = `translate3d(0, ${(p * -260).toFixed(1)}px, 0)`;
        giantRef.current.style.opacity = `${(1 - p * 1.4).toFixed(2)}`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${(p * -110).toFixed(1)}px, 0)`;
        contentRef.current.style.opacity = `${(1 - p * 1.8).toFixed(2)}`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = `${(1 - p * 4).toFixed(2)}`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={outerRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* CAMADA 0 — fundo */}
        <div ref={bgRef} className="absolute inset-[-10%] will-change-transform">
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/55 to-black/35" />
        </div>

        {/* CAMADA 1 — palavra gigante vazada */}
        <div
          ref={giantRef}
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center will-change-transform"
        >
          <span className="text-outline font-serif font-bold uppercase leading-none tracking-tight text-[22vw] md:text-[18vw]">
            {giantWord}
          </span>
        </div>

        {/* CAMADA 2 — conteúdo */}
        <div ref={contentRef} className="relative z-10 max-w-3xl px-4 text-center text-white will-change-transform">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] uppercase tracking-[0.25em] font-medium text-neruma-sand-200">
            {eyebrow}
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mt-6">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-neruma-sand-200/90 max-w-xl mx-auto leading-relaxed font-light mt-5">
            {subtitle}
          </p>
          {children ? <div className="pt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap">{children}</div> : null}
        </div>

        {/* Hint de scroll */}
        <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70">
          <span className="text-[10px] uppercase tracking-[0.3em]">Role para descobrir</span>
          <span className="scroll-hint-dot block w-1.5 h-1.5 rounded-full bg-white/80" />
        </div>
      </div>
    </section>
  );
}
