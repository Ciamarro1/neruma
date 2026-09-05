import React from 'react';
import Link from 'next/link';
import { Container } from '../../../components/ui/Container';
import { constructMetadata } from '../../../lib/seo/metadata';
import { Sparkles, Leaf, Award, HeartHandshake } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'O Manifesto Neruma — Design Orgânico & Soberania Artesanal',
  description:
    'Acreditamos na reconexão humana com a natureza através de peças esculpidas em madeira nobre e fibras naturais.',
  path: '/sobre',
});

export default function SobrePage() {
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light">
            Manifesto de Criação
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            A Alma por Trás da Neruma
          </h1>
          <p className="text-sm text-neruma-sand-400 font-light leading-relaxed">
            Reaproximando o lar contemporâneo dos ritmos orgânicos da Terra.
          </p>
        </div>

        {/* Artigo / Manifesto */}
        <div className="bg-[#1A1816] p-8 sm:p-14 rounded-organic border border-white/10 space-y-8 shadow-2xl shadow-black/80 text-neruma-sand-300 font-light leading-relaxed text-sm">
          <p className="text-lg sm:text-xl font-serif text-white font-medium italic border-l-2 border-neruma-terracotta pl-6 my-6">
            &ldquo;Não criamos apenas objetos decorativos; compomos pontes sensoriais entre o silêncio da floresta e a vivência do seu espaço íntimo.&rdquo;
          </p>

          <p>
            Em um mundo acelerado pela produção em massa desprovida de história, a <strong>Neruma</strong> nasce
            como um refúgio de <em>Slow Design</em>. Nossas criações são geradas no encontro entre artesãos
            tradicionais de Minas Gerais e São Paulo com arquitetura biofílica de vanguarda.
          </p>

          <p>
            Cada metro de cordão de algodão é urdido manualmente através de técnicas milenares de macramê.
            Cada peça de freijó e canela é cortada de manejo florestal sustentável, polida com cera pura de abelha
            silvestre e óleos botânicos que permitem à madeira continuar respirando e envelhecendo com dignidade ao longo das décadas.
          </p>

          {/* Pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div className="p-5 bg-[#141210] rounded-neruma border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-neruma-terracotta-light">
                <Leaf className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-white">Biofilia Real</h3>
              </div>
              <p className="text-xs text-neruma-sand-400">
                Formas fluidas e materiais orgânicos comprovadamente diminuem os níveis de cortisol e promovem restauração cognitiva.
              </p>
            </div>

            <div className="p-5 bg-[#141210] rounded-neruma border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-neruma-terracotta-light">
                <Award className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-white">100% Autoral</h3>
              </div>
              <p className="text-xs text-neruma-sand-400">
                Peças numeradas com certificado de autenticidade e rastreabilidade total da matéria-prima até a bancada de confecção.
              </p>
            </div>
          </div>

          <div className="pt-8 text-center">
            <Link
              href="/produtos"
              className="inline-block px-8 py-3.5 rounded-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg"
            >
              Conheça Nosso Acervo
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
