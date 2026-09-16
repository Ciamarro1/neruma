'use client';

import React from 'react';
import { ParallaxLayer } from './ParallaxLayer';
import { ScrollReveal } from '../ui/ScrollReveal';

interface ManifestoProps {
  eyebrow: string;
  lines: string[];
  description: string;
}

/**
 * Manifesto — tipografia editorial gigante estilo HEAVN
 * "Light that feels like sun." Cada linha em velocidade própria.
 */
export function Manifesto({ eyebrow, lines, description }: ManifestoProps) {
  const speeds = [60, 130, 200];
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <ScrollReveal>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neruma-terracotta-light font-semibold">
            {eyebrow}
          </span>
        </ScrollReveal>
        <div className="mt-6 space-y-1">
          {lines.map((line, i) => (
            <ParallaxLayer key={line} speed={speeds[i % speeds.length]} className="will-change-transform">
              <ScrollReveal delay={i * 120} animation="fade-up">
                <p
                  className={`font-serif font-bold leading-[1.02] tracking-tight ${
                    i % 2 === 1 ? 'text-outline-soft' : 'text-white'
                  } text-5xl sm:text-7xl lg:text-8xl`}
                >
                  {line}
                </p>
              </ScrollReveal>
            </ParallaxLayer>
          ))}
        </div>
        <ScrollReveal delay={200} className="max-w-xl mx-auto mt-8">
          <p className="text-sm sm:text-base text-neruma-sand-300/80 font-light leading-relaxed">{description}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
