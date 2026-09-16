'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

/**
 * useParallax — Multi-Layered Depth sem dependências externas.
 * Calcula o deslocamento de uma camada com base na distância
 * do centro do elemento ao centro da viewport.
 *
 * @param speed deslocamento máximo em px (positivo = move contrário ao scroll, efeito depth).
 *              Ex: fundo lento = 60, meio = 120, frente rápida = 200.
 * @param disabled desativa em prefers-reduced-motion ou mobile se necessário
 */
export function useParallax<T extends HTMLElement>(speed = 120) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!el.isConnected) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -0.5 (topo) .. 0 (centro) .. +0.5 (base) → normaliza para -1..1
      const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
      // Camadas de fundo movem menos, frente move mais (efeito depth)
      const y = centerOffset * speed * -1;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
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
      if (el) el.style.transform = '';
    };
  }, [speed]);

  return ref;
}

/** Estilo base para camadas parallax (GPU-accelerated). */
export const parallaxWillChange: CSSProperties = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
};
