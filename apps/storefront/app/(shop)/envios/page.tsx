import React from 'react';
import Link from 'next/link';
import { Container } from '../../../components/ui/Container';
import { constructMetadata } from '../../../lib/seo/metadata';
import { Truck, ShieldCheck, Box, Clock, Sparkles } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Prazos & Política de Envio — Neruma Design',
  description:
    'Conheça nossa logística protegida, embalagens antichoque sustentáveis e prazos de entrega em todo o Brasil.',
  path: '/envios',
});

export default function EnviosPage() {
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        {/* Cabeçalho */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light">
            Logística & Cuidados
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Prazos & Política de Envio
          </h1>
          <p className="text-sm text-neruma-sand-400 font-light leading-relaxed">
            Como garantimos que sua peça artesanal chegue impecável ao seu destino.
          </p>
        </div>

        {/* Cards de Etapas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1A1816] p-6 rounded-organic border border-white/10 space-y-3 text-center shadow-xl shadow-black/60">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-neruma-terracotta-light">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-white">1. Confecção Manual</h3>
            <p className="text-xs text-neruma-sand-400 font-light leading-relaxed">
              5 a 8 dias úteis na bancada do artesão, com conferência rigorosa de acabamentos.
            </p>
          </div>

          <div className="bg-[#1A1816] p-6 rounded-organic border border-white/10 space-y-3 text-center shadow-xl shadow-black/60">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-neruma-terracotta-light">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-white">2. Embalagem Blindada</h3>
            <p className="text-xs text-neruma-sand-400 font-light leading-relaxed">
              Papel colmeia expansível antichoque e caixa dupla sem nenhum plástico descartável.
            </p>
          </div>

          <div className="bg-[#1A1816] p-6 rounded-organic border border-white/10 space-y-3 text-center shadow-xl shadow-black/60">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-neruma-terracotta-light">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-white">3. Envio Expresso</h3>
            <p className="text-xs text-neruma-sand-400 font-light leading-relaxed">
              SEDEX com rastreamento online em tempo real e seguro total contra sinistros.
            </p>
          </div>
        </div>

        {/* Políticas Detalhadas */}
        <div className="bg-[#1A1816] p-8 sm:p-12 rounded-organic border border-white/10 space-y-6 text-xs sm:text-sm text-neruma-sand-300 font-light leading-relaxed shadow-2xl">
          <h2 className="font-serif text-xl font-bold text-white mb-2">Frete Grátis para Todo o Brasil</h2>
          <p>
            Oferecemos <strong>Frete Grátis</strong> automático via SEDEX em todos os pedidos acima de <strong>R$ 500,00</strong>.
            Para pedidos abaixo desse valor, o frete fixo de proteção especial é de R$ 28,50.
          </p>

          <h2 className="font-serif text-xl font-bold text-white pt-4 mb-2">Rastreamento de Pedidos</h2>
          <p>
            Assim que sua peça for expedida pelo nosso ateliê, você receberá o código de rastreio dos Correios diretamente no seu WhatsApp e e-mail cadastrado, permitindo acompanhar o deslocamento passo a passo.
          </p>

          <h2 className="font-serif text-xl font-bold text-white pt-4 mb-2">Seguro de Transporte Garantido</h2>
          <p>
            Caso ocorra qualquer avaria durante o transporte, providenciamos imediatamente a substituição prioritária da peça ou o estorno integral do valor pago, sem qualquer burocracia.
          </p>
        </div>
      </Container>
    </div>
  );
}
