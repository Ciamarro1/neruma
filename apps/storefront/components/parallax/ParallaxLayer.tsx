'use client';

import React, { type ReactNode } from 'react';
import { useParallax, parallaxWillChange } from './useParallax';

interface ParallaxLayerProps {
  children: ReactNode;
  /** Deslocamento em px. Fundo = 40-80, meio = 100-160, frente = 180-260. */
  speed?: number;
  className?: string;
  /** Velocidade extra no eixo X para drift lateral sutil */
  driftX?: number;
}

/**
 * ParallaxLayer — envolve qualquer conteúdo e o move em velocidade
 * própria no scroll, criando profundidade multi-camadas (estilo HEAVN One).
 */
export function ParallaxLayer({ children, speed = 120, className = '', driftX = 0 }: ParallaxLayerProps) {
  const ref = useParallax<HTMLDivElement>(speed);

  return (
    <div
      ref={ref}
      className={className}
      style={parallaxWillChange}
      data-parallax-speed={speed}
      data-parallax-drift={driftX}
    >
      {children}
    </div>
  );
}
