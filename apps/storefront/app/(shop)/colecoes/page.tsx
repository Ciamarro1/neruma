import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container';
import { constructMetadata } from '../../../lib/seo/metadata';
import { ArrowRight, Sparkles } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Coleções Editoriais & Cápsulas Autorais — Neruma',
  description:
    'Conheça as coleções conceituais de design biofílico que unem materiais orgânicos a geometrias sagradas.',
  path: '/colecoes',
});

const COLLECTIONS = [
  {
    id: 'luz-organica',
    title: 'Coleção Luz Orgânica',
    subtitle: 'Luminárias pendentes tecidas em nós fluidos de macramê e fibras de algodão cru.',
    image: '/images/products/luminaria-macrame-algodao.jpg',
    piecesCount: '3 peças autorais com visualização 3D',
    link: '/categorias/luminarias-organicas',
  },
  {
    id: 'raizes-ancestrais',
    title: 'Coleção Raízes & Texturas',
    subtitle: 'Painéis e esculturas de parede que exploram a rudeza tátil do sisal e a nobreza do freijó.',
    image: '/images/products/painel-aura-algodao.jpg',
    piecesCount: '4 painéis de grande formato',
    link: '/categorias/quadros-e-paineis',
  },
  {
    id: 'conforto-biofilico',
    title: 'Coleção Habitat Pet Biofílico',
    subtitle: 'Mobiliário pet elevado e integrado com harmonia às linhas arquitetônicas de alto padrão.',
    image: '/images/products/quadro-raizes-sisal.jpg',
    piecesCount: '2 criações artesanais',
    link: '/categorias/mobiliario-pet',
  },
];

export default function ColecoesPage() {
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        {/* Cabeçalho */}
        <div className="border-b border-white/10 pb-10 mb-14">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Cápsulas de Design
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Coleções Autorais
          </h1>
          <p className="text-sm text-neruma-sand-400 max-w-2xl font-light leading-relaxed">
            Cada coleção é concebida como uma narrativa tátil: um tributo aos elementos da terra,
            à manualidade do ateliê brasileiro e à geometria orgânica que conecta arquitetura e natureza.
          </p>
        </div>

        {/* Grade de Coleções */}
        <div className="space-y-12">
          {COLLECTIONS.map((col, idx) => (
            <div
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#1A1816] rounded-organic p-6 sm:p-10 border border-white/10 hover:border-neruma-terracotta-light/30 transition-all duration-500 shadow-2xl shadow-black/80`}
            >
              {/* Imagem da Coleção */}
              <div
                className={`lg:col-span-6 relative aspect-[16/10] rounded-organic overflow-hidden border border-white/10 ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] text-neruma-sand-200 uppercase tracking-widest font-medium">
                  <Sparkles className="w-3 h-3 text-neruma-terracotta-light" />
                  <span>{col.piecesCount}</span>
                </div>
              </div>

              {/* Conteúdo Textual */}
              <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-neruma-terracotta-light">
                  Coleção Cápsula 0{idx + 1}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {col.title}
                </h2>
                <p className="text-sm text-neruma-sand-400 font-light leading-relaxed">
                  {col.subtitle}
                </p>
                <div className="pt-4">
                  <Link
                    href={col.link}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-neruma-terracotta/25"
                  >
                    <span>Explorar Coleção</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
