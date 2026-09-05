'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, X, ArrowRight } from 'lucide-react';

interface Hotspot {
  xPercent: number;
  yPercent: number;
  medusaProductHandle: string;
  customLabel?: string;
  product?: {
    title: string;
    price: number;
    thumbnail?: string;
  };
}

interface LookbookSceneProps {
  title: string;
  sceneImageUrl: string;
  hotspots: Hotspot[];
}

export const LookbookScene: React.FC<LookbookSceneProps> = ({
  title,
  sceneImageUrl,
  hotspots = [],
}) => {
  const [activeHotspotIndex, setActiveHotspotIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full aspect-[16/10] bg-[#1A1816] rounded-organic overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
      <Image
        src={sceneImageUrl}
        alt={title}
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover object-center opacity-90"
      />

      {/* Hotspots Overlay */}
      {hotspots.map((hotspot, index) => {
        const isActive = activeHotspotIndex === index;

        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
          >
            {/* Pulse Button */}
            <button
              onClick={() => setActiveHotspotIndex(isActive ? null : index)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isActive
                  ? 'bg-neruma-terracotta text-white scale-110'
                  : 'bg-[#141210]/90 backdrop-blur-md text-white hover:scale-110 hover:bg-neruma-terracotta border border-white/20'
              }`}
              aria-label="Ver produto"
            >
              {isActive ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Popover Card */}
            {isActive && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-64 bg-[#1E1B18]/95 backdrop-blur-md p-4 rounded-organic border border-white/15 shadow-2xl z-30 animate-fade-in text-white">
                <p className="text-xs uppercase tracking-wider font-semibold text-neruma-terracotta-light mb-1">
                  {hotspot.customLabel || 'Obra em Destaque'}
                </p>
                <h4 className="font-serif text-sm font-bold line-clamp-1 mb-2">
                  {hotspot.product?.title || 'Peça Neruma'}
                </h4>
                <Link
                  href={`/produto/${hotspot.medusaProductHandle}`}
                  className="inline-flex items-center text-xs font-semibold text-neruma-terracotta-light hover:text-white transition-colors"
                >
                  Ver Detalhes e 3D <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
