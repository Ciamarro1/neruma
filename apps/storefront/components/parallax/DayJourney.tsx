'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '../ui/ScrollReveal';

export interface DayMoment {
  time: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}

interface DayJourneyProps {
  eyebrow: string;
  heading: string;
  description: string;
  moments: DayMoment[];
}

/**
 * DayJourney — storytelling fixo estilo HEAVN "Your working day".
 * Coluna esquerda (desktop): imagem sticky com crossfade + zoom parallax.
 * Coluna direita: cartões que rolam; o cartão ativo troca a imagem.
 */
export function DayJourney({ eyebrow, heading, description, moments }: DayJourneyProps) {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [moments.length]);

  return (
    <section className="bg-[#181614] border-y border-white/5 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal className="max-w-2xl mb-14">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light mb-2 block">
            {eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">{heading}</h2>
          <p className="text-sm text-neruma-sand-400/80 font-light mt-3 leading-relaxed">{description}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Imagem sticky */}
          <div className="relative">
            <div className="lg:sticky lg:top-24 relative aspect-[4/5] rounded-organic overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
              {moments.map((m, i) => (
                <div
                  key={m.time}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={m.image}
                    alt={m.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover ${i === active ? 'animate-slow-zoom' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-white">
                    <span className="font-serif text-5xl font-bold tabular-nums">{m.time}</span>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-neruma-sand-300">
                      {i + 1} / {moments.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cartões roláveis */}
          <div className="flex flex-col">
            {moments.map((m, i) => (
              <div
                key={m.time}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-index={i}
                className="min-h-[60vh] lg:min-h-[80vh] flex items-center"
              >
                <ScrollReveal
                  animation="fade-up"
                  className={`w-full rounded-organic border p-7 sm:p-9 transition-colors duration-500 ${
                    i === active
                      ? 'bg-white/[0.06] border-neruma-terracotta-light/40 shadow-2xl shadow-black/50'
                      : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <span
                    className={`font-serif text-4xl font-bold tabular-nums transition-colors ${
                      i === active ? 'text-neruma-terracotta-light' : 'text-white/25'
                    }`}
                  >
                    {m.time}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-3">{m.title}</h3>
                  <p className="text-sm text-neruma-sand-300/85 font-light leading-relaxed mt-3">{m.text}</p>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
