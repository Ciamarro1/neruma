import React from 'react';
import { Container } from '../../../components/ui/Container';
import { constructMetadata } from '../../../lib/seo/metadata';

export const metadata = constructMetadata({
  title: 'Termos de Uso & Condições de Compra — Neruma Design',
  description: 'Regulamento de compras, garantias e direitos do consumidor da plataforma Neruma.',
  path: '/termos',
});

export default function TermosPage() {
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        <div className="border-b border-white/10 pb-6 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Contrato de Serviço
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Termos de Uso & Compra
          </h1>
          <p className="text-xs text-neruma-sand-400 mt-1 font-light">
            Regras gerais e diretrizes para navegação e aquisição de peças no acervo Neruma.
          </p>
        </div>

        <div className="bg-[#1A1816] p-8 sm:p-12 rounded-organic border border-white/10 space-y-6 text-xs sm:text-sm text-neruma-sand-300 font-light leading-relaxed shadow-2xl">
          <h2 className="font-serif text-lg font-bold text-white">1. Natureza Artesanal dos Produtos</h2>
          <p>
            Por se tratarem de peças manufaturadas artesanalmente em madeira maciça e fibras naturais, pequenas variações na tonalidade dos veios da madeira e na textura dos nós são características autênticas da nobreza dos materiais e não constituem defeitos.
          </p>

          <h2 className="font-serif text-lg font-bold text-white pt-4">2. Prazos e Encomendas</h2>
          <p>
            O prazo de confecção começa a contar a partir da confirmação do pagamento. O cliente recebe atualizações sobre cada etapa (corte da madeira, tecelagem e expedição).
          </p>

          <h2 className="font-serif text-lg font-bold text-white pt-4">3. Direito de Arrependimento</h2>
          <p>
            Em total acordo com o Art. 49 do Código de Defesa do Consumidor (CDC), o cliente tem o prazo de 7 (sete) dias corridos a partir da data de entrega para manifestar o direito de arrependimento e devolução com reembolso integral.
          </p>
        </div>
      </Container>
    </div>
  );
}
