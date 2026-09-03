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
    <div className="relative w-full aspect-[16/10] bg-neruma-sand-100 rounded-organic overflow-hidden shadow-organic border border-neruma-border">
      <Image
        src={sceneImageUrl}
        alt={title}
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover object-center"
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
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isActive
                  ? 'bg-neruma-terracotta text-white scale-110'
                  : 'bg-neruma-bg/90 backdrop-blur-md text-neruma-dark hover:scale-110 hover:bg-white'
              }`}
              aria-label={`Ver item ${hotspot.customLabel || hotspot.medusaProductHandle}`}
            >
              {isActive ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Floating Product Popover */}
            {isActive ? (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md rounded-neruma p-4 shadow-xl border border-neruma-border text-left z-30 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-neruma-terracotta mb-1">
                  Shop the Look
                </p>
                <h4 className="font-serif text-sm font-medium text-neruma-dark mb-2">
                  {hotspot.customLabel || hotspot.medusaProductHandle.replace(/-/g, ' ')}
                </h4>
                <Link
                  href={`/produto/${hotspot.medusaProductHandle}`}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neruma-wood hover:text-neruma-dark transition-colors"
                >
                  Ver Peça no Catálogo <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
