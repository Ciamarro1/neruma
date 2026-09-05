'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ScrollReveal } from '../ui/ScrollReveal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ShieldCheck,
  Truck,
  Leaf,
  Ruler,
  Sparkles,
  Paintbrush,
  MapPin,
  Award,
  RefreshCw,
  ChevronDown,
  Camera,
  Box,
  RotateCw,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

// Lazy load do viewer 3D — Three.js não entra no bundle principal
const ProductViewer3D = dynamic(
  () => import('./ProductViewer3D').then((m) => ({ default: m.ProductViewer3D })),
  {
    ssr: false,
    loading: () => (
      <div className="relative aspect-square lg:aspect-[4/3] w-full bg-[#141210] rounded-organic overflow-hidden flex flex-col items-center justify-center border border-white/10">
        <div className="w-8 h-8 border-2 border-neruma-terracotta-light border-t-transparent rounded-full animate-spin" />
        <span className="mt-3 text-xs text-neruma-sand-300 uppercase tracking-widest">
          Carregando ambiente 3D...
        </span>
      </div>
    ),
  }
);

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface ProductImmersiveProps {
  product: {
    id?: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    images?: Array<{ url: string }>;
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
  modelUrl?: string | null;
  formattedPrice: string;
  formattedDimensions: string | null;
  formattedWeight: string | null;
}

/* ------------------------------------------------------------------ */
/* Componente Principal 100% Dark Mode (Zenin Sound Speaker Style)      */
/* ------------------------------------------------------------------ */
export function ProductImmersivePDP({
  product,
  handle,
  modelUrl,
  formattedPrice,
  formattedDimensions,
  formattedWeight,
}: ProductImmersiveProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Abre sempre na foto primeiro conforme solicitação
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [activeImage, setActiveImage] = useState<string>(product.thumbnail || '');

  const handleAddToCart = () => {
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.calculated_price?.calculated_amount || 0;
    addItem(
      {
        id: product.id || handle,
        title: product.title,
        handle,
        thumbnail: product.thumbnail || activeImage,
        variantId: defaultVariant?.id,
        price,
      },
      1
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const metadata: any = product.metadata || {};
  const dimensions = metadata.dimensions;
  const shippingMeta = metadata.shipping;
  const design = metadata.design;
  const manufacturing = metadata.manufacturing;
  const sustainability = metadata.sustainability;
  const merchandising = metadata.merchandising;

  return (
    <div className="w-full bg-[#141210] text-neruma-sand-100 selection:bg-neruma-terracotta selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION — Dark Background + Foto / 3D Switcher       */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] bg-[#141210] overflow-hidden pt-6 pb-16">
        {/* Luz ambiente de fundo sutil */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-neruma-wood-dark/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neruma-terracotta-dark/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb estilo Zenin */}
          <nav className="text-xs text-neruma-sand-400/60 uppercase tracking-widest mb-8">
            <a href="/" className="hover:text-neruma-sand-200 transition-colors">Início</a>
            <span className="mx-2.5 opacity-30">/</span>
            <a href="/produtos" className="hover:text-neruma-sand-200 transition-colors">Catálogo</a>
            <span className="mx-2.5 opacity-30">/</span>
            <span className="text-neruma-sand-200 font-medium">{product.title}</span>
          </nav>

          {/* Grid Principal: Mídia (Foto ou 3D) + Bloco Comercial */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Coluna Visual */}
            <div className="lg:col-span-7 relative space-y-3">
              {/* Barra de Alternância: Foto vs 3D (exibida quando há modelo 3D) */}
              {modelUrl && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 p-1 bg-[#1E1B18]/90 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                    <button
                      type="button"
                      onClick={() => setViewMode('photo')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                        viewMode === 'photo'
                          ? 'bg-neruma-wood text-white shadow-md'
                          : 'text-neruma-sand-300 hover:text-white'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Fotografia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('3d')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                        viewMode === '3d'
                          ? 'bg-neruma-terracotta text-white shadow-md'
                          : 'text-neruma-sand-300 hover:text-white'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5 text-neruma-terracotta-light" />
                      <span>Modelo 3D Interativo</span>
                    </button>
                  </div>

                  {viewMode === '3d' ? (
                    <span className="text-[11px] text-neruma-terracotta-light uppercase tracking-widest hidden sm:flex items-center gap-1.5 font-medium">
                      <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                      360° Ativo
                    </span>
                  ) : (
                    <span className="text-[11px] text-neruma-sand-400/60 uppercase tracking-widest hidden sm:inline">
                      Alta Resolução
                    </span>
                  )}
                </div>
              )}

              {/* Card de Mídia */}
              <ScrollReveal animation="scale-up" duration={900}>
                <div className="relative aspect-square lg:aspect-[4/3] w-full rounded-organic overflow-hidden shadow-2xl shadow-black/80 bg-[#1A1816] border border-white/10">
                  {/* Modo Foto (padrão) */}
                  {viewMode === 'photo' && (
                    <div className="relative w-full h-full group">
                      {activeImage ? (
                        <Image
                          src={activeImage}
                          alt={product.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neruma-sand-400/50 uppercase tracking-widest text-xs">
                          Sem Imagem
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Botão em destaque para abrir o modelo 3D */}
                      {modelUrl && (
                        <button
                          type="button"
                          onClick={() => setViewMode('3d')}
                          className="absolute bottom-5 right-5 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/80 hover:bg-neruma-terracotta text-white text-xs font-semibold tracking-wider border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 group/btn"
                        >
                          <Box className="w-4 h-4 text-neruma-terracotta-light group-hover/btn:text-white transition-colors" />
                          <span>Visualizar em 3D</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Modo 3D */}
                  {viewMode === '3d' && modelUrl && (
                    <ProductViewer3D
                      modelUrl={modelUrl}
                      fallbackImageUrl={activeImage || undefined}
                      productTitle={product.title}
                      className="w-full h-full"
                    />
                  )}

                  {/* Badge de Lançamento / Artesanal */}
                  {merchandising?.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <Badge variant="wood">{merchandising.badge}</Badge>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Miniaturas de Galeria se houver múltiplas fotos */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 pt-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.url || idx}
                      type="button"
                      onClick={() => {
                        setActiveImage(img.url);
                        setViewMode('photo');
                      }}
                      className={`relative w-16 h-16 rounded-neruma overflow-hidden border transition-all ${
                        activeImage === img.url && viewMode === 'photo'
                          ? 'border-neruma-terracotta ring-2 ring-neruma-terracotta'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.title} miniatura ${idx + 1}`}
                        fill
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Coluna de Informações Comerciais */}
            <div className="lg:col-span-5 space-y-7">
              <ScrollReveal animation="fade-up" delay={150}>
                {/* Tag de Material */}
                {design?.materials?.[0] && (
                  <span className="inline-block text-[11px] uppercase tracking-[0.25em] font-semibold text-neruma-terracotta-light border border-neruma-terracotta-light/30 px-3.5 py-1 rounded-full bg-neruma-terracotta/10">
                    {design.materials[0].replace(/_/g, ' ')}
                  </span>
                )}

                {/* Título Principal */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mt-4">
                  {product.title}
                </h1>

                {/* Subtítulo */}
                {product.subtitle && (
                  <p className="text-sm sm:text-base text-neruma-sand-300/80 leading-relaxed mt-3 font-light">
                    {product.subtitle}
                  </p>
                )}
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                {/* Preço e Parcelamento */}
                <div className="pt-4 border-t border-white/10">
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {formattedPrice}
                  </span>
                  <span className="block text-xs text-neruma-sand-400/70 mt-1.5 font-light">
                    em até 10x sem juros no cartão ou com 5% de desconto no Pix
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={400}>
                {/* Dimensões e Peso Rápidos */}
                {(formattedDimensions || formattedWeight) && (
                  <div className="flex items-center gap-6 py-3.5 px-5 bg-white/5 rounded-organic border border-white/10 text-xs text-neruma-sand-200">
                    {formattedDimensions && (
                      <div className="flex items-center gap-2.5">
                        <Ruler className="w-4 h-4 text-neruma-terracotta-light" />
                        <span>{formattedDimensions}</span>
                      </div>
                    )}
                    {formattedWeight && (
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-neruma-terracotta-light" />
                        <span>{formattedWeight}</span>
                      </div>
                    )}
                  </div>
                )}
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={500}>
                {/* Botão de Compra Primário */}
                <div className="pt-2 space-y-3.5">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className={`w-full text-white text-sm font-semibold tracking-wider py-4 transition-all duration-300 shadow-lg ${
                      isAdded
                        ? 'bg-neruma-olive hover:bg-neruma-olive-light shadow-neruma-olive/30'
                        : 'bg-neruma-terracotta hover:bg-neruma-terracotta-dark shadow-neruma-terracotta/25 hover:shadow-neruma-terracotta/40'
                    }`}
                  >
                    {isAdded ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Adicionado à Sacola!
                      </span>
                    ) : (
                      'Adicionar à Sacola'
                    )}
                  </Button>
                  <p className="text-[11px] text-center text-neruma-sand-400/60 font-light">
                    ⚡ Peça artesanal sob encomenda — prazo de produção:{' '}
                    <span className="text-neruma-sand-200 font-medium">
                      {manufacturing?.production_time_hours
                        ? `${Math.round(manufacturing.production_time_hours)}h`
                        : '5 a 8 dias úteis'}
                    </span>
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Indicador de rolagem */}
          <div className="flex flex-col items-center justify-center mt-12 text-center text-neruma-sand-400/40 animate-pulse">
            <span className="text-[10px] uppercase tracking-[0.25em] mb-2 font-light">Conheça os detalhes</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FEATURES EM CARDS DARK GLASS                              */}
      {/* ============================================================ */}
      <section className="bg-[#181614] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neruma-terracotta-light font-semibold">
                Excelência Artesanal
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
                Cada Nó Conta uma História
              </h2>
              <p className="text-sm text-neruma-sand-300/70 mt-3 max-w-lg mx-auto leading-relaxed font-light">
                Tradição brasileira reinterpretada pelo design contemporâneo. Cada peça é única e irrepetível.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid de Cards Escuros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Materiais */}
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="group p-8 bg-[#201D1A]/80 rounded-organic border border-white/10 hover:border-neruma-terracotta-light/40 transition-all duration-500 hover:-translate-y-1 shadow-lg shadow-black/40">
                <div className="w-12 h-12 rounded-full bg-neruma-terracotta/15 flex items-center justify-center mb-6 group-hover:bg-neruma-terracotta/25 transition-colors">
                  <Paintbrush className="w-5 h-5 text-neruma-terracotta-light" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2.5">
                  Fibras Nobres
                </h3>
                <p className="text-sm text-neruma-sand-300/70 leading-relaxed font-light">
                  {design?.materials
                    ? design.materials.map((m: string) => m.replace(/_/g, ' ')).join(', ')
                    : 'Fibras 100% naturais'}
                  . Nós tecidos à mão que difundem a luminosidade com suavidade e calor.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 2: Ateliê */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="group p-8 bg-[#201D1A]/80 rounded-organic border border-white/10 hover:border-neruma-terracotta-light/40 transition-all duration-500 hover:-translate-y-1 shadow-lg shadow-black/40">
                <div className="w-12 h-12 rounded-full bg-neruma-terracotta/15 flex items-center justify-center mb-6 group-hover:bg-neruma-terracotta/25 transition-colors">
                  <MapPin className="w-5 h-5 text-neruma-terracotta-light" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2.5">
                  100% Autoral
                </h3>
                <p className="text-sm text-neruma-sand-300/70 leading-relaxed font-light">
                  Concebido e produzido por{' '}
                  <strong className="text-white font-medium">
                    {manufacturing?.artisan_name || 'artesãos Neruma'}
                  </strong>
                  {manufacturing?.workshop_location && ` em ${manufacturing.workshop_location}`}.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 3: Sustentabilidade */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="group p-8 bg-[#201D1A]/80 rounded-organic border border-white/10 hover:border-neruma-terracotta-light/40 transition-all duration-500 hover:-translate-y-1 shadow-lg shadow-black/40">
                <div className="w-12 h-12 rounded-full bg-neruma-olive/15 flex items-center justify-center mb-6 group-hover:bg-neruma-olive/25 transition-colors">
                  <Leaf className="w-5 h-5 text-neruma-olive-light" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2.5">
                  Biofílica & Sustentável
                </h3>
                <p className="text-sm text-neruma-sand-300/70 leading-relaxed font-light">
                  {sustainability?.certifications?.[0] || 'Materiais de origem sustentável'}.
                  {sustainability?.plastic_free_packaging && ' Embalagem 100% livre de plásticos.'}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SEÇÃO SPECS TÉCNICAS DARK                                  */}
      {/* ============================================================ */}
      <section className="relative bg-[#141210] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Foto de detalhe em moldura escura */}
            <ScrollReveal animation="slide-left">
              <div className="relative aspect-square rounded-organic overflow-hidden bg-[#1A1816] border border-white/10 shadow-2xl shadow-black/80">
                {product.thumbnail && (
                  <Image
                    src={product.thumbnail}
                    alt={`${product.title} — acabamento`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </ScrollReveal>

            {/* Tabela de especificações técnicas escura */}
            <div>
              <ScrollReveal animation="fade-up">
                <span className="text-[10px] uppercase tracking-[0.3em] text-neruma-terracotta-light font-semibold">
                  Ficha Técnica
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3 mb-8">
                  Especificações do Produto
                </h2>
              </ScrollReveal>

              <div className="space-y-0 divide-y divide-white/10">
                {[
                  {
                    label: 'Materiais',
                    value: design?.materials?.map((m: string) => m.replace(/_/g, ' ')).join(', ') || 'Fibras e madeira nobre',
                    icon: Paintbrush,
                  },
                  {
                    label: 'Dimensões',
                    value: formattedDimensions || 'Sob consulta',
                    icon: Ruler,
                  },
                  {
                    label: 'Peso líquido',
                    value: formattedWeight || 'Sob consulta',
                    icon: Sparkles,
                  },
                  {
                    label: 'Estilos',
                    value: design?.styles?.map((s: string) => s.replace(/_/g, ' ')).join(', ') || 'Orgânico, Biofílico',
                    icon: Award,
                  },
                  {
                    label: 'Ambientes sugeridos',
                    value: design?.rooms?.map((r: string) => r.replace(/_/g, ' ')).join(', ') || 'Sala de estar, Quarto',
                    icon: MapPin,
                  },
                  {
                    label: 'Acabamento',
                    value: design?.finishes?.map((f: string) => f.replace(/_/g, ' ')).join(', ') || 'Cera de abelha natural',
                    icon: RefreshCw,
                  },
                ].map((spec, i) => (
                  <ScrollReveal key={spec.label} animation="fade-up" delay={i * 70}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <spec.icon className="w-4 h-4 text-neruma-terracotta-light/80" />
                        <span className="text-xs uppercase tracking-wider text-neruma-sand-400/80 font-medium">
                          {spec.label}
                        </span>
                      </div>
                      <span className="text-sm text-white font-medium text-right max-w-[60%]">
                        {spec.value}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. STORYTELLING & PROCESSO CRIATIVO                           */}
      {/* ============================================================ */}
      <section className="bg-[#181614] py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neruma-terracotta-light font-semibold">
                Inspiração & Alma
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
                Conceito & Filosofia
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className="space-y-6 text-neruma-sand-300/80 leading-relaxed font-light text-base">
              <p>{product.description}</p>
              {manufacturing?.artisan_name && (
                <blockquote className="border-l-2 border-neruma-terracotta bg-[#201D1A]/60 p-6 rounded-r-organic not-italic border-t border-b border-r border-white/5">
                  <p className="text-neruma-sand-100 italic">
                    &ldquo;Cada criação Neruma nasce do respeito aos veios da madeira e às fibras do algodão, buscando a harmonia pura entre a natureza e a vida cotidiana.&rdquo;
                  </p>
                  <p className="text-xs text-neruma-terracotta-light mt-3 font-semibold uppercase tracking-wider not-italic">
                    — {manufacturing.artisan_name} {manufacturing.workshop_location ? `(${manufacturing.workshop_location})` : ''}
                  </p>
                </blockquote>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. TRUST BANNER DARK                                         */}
      {/* ============================================================ */}
      <section className="bg-[#100F0E] py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1C1A17] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                  <Truck className="w-5 h-5 text-neruma-terracotta-light" />
                </div>
                <h4 className="font-serif text-base font-bold text-white mb-1.5">Entrega Segura</h4>
                <p className="text-xs text-neruma-sand-400/80 font-light max-w-xs leading-relaxed">
                  Embalagem reforçada com proteção interna em papel colmeia antichoque.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1C1A17] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                  <Leaf className="w-5 h-5 text-neruma-olive-light" />
                </div>
                <h4 className="font-serif text-base font-bold text-white mb-1.5">100% Sustentável</h4>
                <p className="text-xs text-neruma-sand-400/80 font-light max-w-xs leading-relaxed">
                  Fibras naturais livres de compostos tóxicos e embalagem zero plástico.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1C1A17] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-neruma-terracotta-light" />
                </div>
                <h4 className="font-serif text-base font-bold text-white mb-1.5">Garantia Ateliê</h4>
                <p className="text-xs text-neruma-sand-400/80 font-light max-w-xs leading-relaxed">
                  1 ano de garantia direta com nossos artesãos contra defeitos estruturais.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. STICKY CTA MOBILE                                         */}
      {/* ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#141210]/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">{formattedPrice}</p>
            <p className="text-[10px] text-neruma-sand-400/60 font-light">10x sem juros no cartão</p>
          </div>
          <Button
            size="lg"
            onClick={handleAddToCart}
            className={`text-white text-sm font-semibold px-7 py-3 shadow-lg transition-all duration-300 ${
              isAdded
                ? 'bg-neruma-olive hover:bg-neruma-olive-light shadow-neruma-olive/30'
                : 'bg-neruma-terracotta hover:bg-neruma-terracotta-dark shadow-neruma-terracotta/30'
            }`}
          >
            {isAdded ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Adicionado!
              </span>
            ) : (
              'Adicionar à Sacola'
            )}
          </Button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}
