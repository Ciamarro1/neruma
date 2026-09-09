'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CinematicFocusWaypoint } from '@neruma/types';

interface CinematicArtworkCanvasProps {
  artworkUrl: string;
  aspectRatio: number;
  waypoints: CinematicFocusWaypoint[];
  activeActIndex: number;
  progressInAct: number; // 0.0 a 1.0 dentro do ato ativo
  altText: string;
}

/**
 * Motor Cinematográfico de Canvas 2D
 * Inspirado em scroll-attached-website: executa transformações afins contínuas
 * (pan, zoom, iluminação rasante) diretamente sobre a imagem 1:1 imutável,
 * garantindo resolução nativa 60-120fps sem perda de fidelidade nem alucinação.
 */
export function CinematicArtworkCanvas({
  artworkUrl,
  aspectRatio,
  waypoints,
  activeActIndex,
  progressInAct,
  altText,
}: CinematicArtworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Estado atual interpolado de câmera
  const currentCameraRef = useRef({
    x: 50.0,
    y: 50.0,
    zoom: 1.0,
    lightAlpha: 0.6,
  });

  // Mapear waypoint alvo baseado no ato ativo
  const getTargetWaypoint = useCallback(
    (actIdx: number): CinematicFocusWaypoint => {
      // Atos 1 e 2: Visão Geral (wp_full_overview)
      // Atos 3: Relevo Sisal (wp_sisal_relief)
      // Ato 4: Trama Algodão (wp_canvas_texture)
      // Ato 5: Moldura Freijó (wp_frame_freijo)
      // Atos 6: Relevo Sisal
      // Atos 7 e 8: Visão Geral
      if (actIdx === 0 || actIdx === 1 || actIdx >= 6) {
        return waypoints.find((w) => w.id === 'wp_full_overview') || waypoints[0];
      }
      if (actIdx === 2 || actIdx === 5) {
        return waypoints.find((w) => w.id === 'wp_sisal_relief') || waypoints[1] || waypoints[0];
      }
      if (actIdx === 3) {
        return waypoints.find((w) => w.id === 'wp_canvas_texture') || waypoints[2] || waypoints[0];
      }
      if (actIdx === 4) {
        return waypoints.find((w) => w.id === 'wp_frame_freijo') || waypoints[3] || waypoints[0];
      }
      return waypoints[0];
    },
    [waypoints]
  );

  // Pré-carregamento da imagem original
  useEffect(() => {
    const img = new Image();
    img.src = artworkUrl;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, [artworkUrl]);

  // Loop de renderização no Canvas
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      if (!canvas || !img || !imageLoaded) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      // Interpolar câmera suavemente em direção ao waypoint do ato atual
      const targetWp = getTargetWaypoint(activeActIndex);
      const lerpFactor = 0.08;

      const cam = currentCameraRef.current;
      cam.x += (targetWp.x_percent - cam.x) * lerpFactor;
      cam.y += (targetWp.y_percent - cam.y) * lerpFactor;
      cam.zoom += (targetWp.zoom_scale - cam.zoom) * lerpFactor;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Fundo escuro museológico
      ctx.fillStyle = '#12100E';
      ctx.fillRect(0, 0, width, height);

      // Cálculo de enquadramento da imagem
      // Manter proporção centralizada
      const imgAspect = img.width / img.height;
      let drawW: number;
      let drawH: number;

      // Margem de respiro de 12% na visualização 1x
      const paddingFactor = 0.86;
      if (width / height > imgAspect) {
        drawH = height * paddingFactor;
        drawW = drawH * imgAspect;
      } else {
        drawW = width * paddingFactor;
        drawH = drawW / imgAspect;
      }

      // Ponto focal normalizado (0 a 1)
      const focalNormX = cam.x / 100;
      const focalNormY = cam.y / 100;

      // Transformação afim centrada no ponto focal
      ctx.translate(width / 2, height / 2);
      ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(
        -(focalNormX - 0.5) * drawW,
        -(focalNormY - 0.5) * drawH
      );

      // Sombra de contato suave da moldura
      if (cam.zoom < 1.3) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 24;
      }

      // Desenhar a imagem imutável 1:1
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Camada de iluminação cênica de galeria
      ctx.save();
      ctx.scale(dpr, dpr);

      // Gradiente radial simulando foco de luz da galeria
      const lightGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );

      if (targetWp.lighting_mood === 'raking_light') {
        // Luz rasante para destacar a textura tridimensional do relevo
        lightGrad.addColorStop(0, 'rgba(255, 248, 235, 0.05)');
        lightGrad.addColorStop(0.7, 'rgba(18, 16, 14, 0.4)');
        lightGrad.addColorStop(1, 'rgba(12, 10, 8, 0.85)');
      } else {
        // Spot clássico de museu
        lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
        lightGrad.addColorStop(0.8, 'rgba(18, 16, 14, 0.35)');
        lightGrad.addColorStop(1, 'rgba(12, 10, 8, 0.75)');
      }

      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, width, height);

      // Vinheta sutil nas bordas do viewport
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.9
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(10, 8, 7, 0.9)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [imageLoaded, activeActIndex, getTargetWaypoint]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#12100E]">
      <canvas
        ref={canvasRef}
        aria-label={altText}
        className="w-full h-full block"
      />

      {/* Indicador de carregamento enquanto decodifica a imagem original */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#12100E] z-20">
          <div className="w-8 h-8 border-2 border-neruma-terracotta border-t-transparent rounded-full animate-spin" />
          <span className="mt-3 text-xs uppercase tracking-widest text-neruma-sand-300 font-sans">
            Ajustando Foco Óptico da Galeria...
          </span>
        </div>
      )}
    </div>
  );
}
