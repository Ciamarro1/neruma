import React from 'react';
import { Container } from '../../../components/ui/Container';
import { constructMetadata } from '../../../lib/seo/metadata';

export const metadata = constructMetadata({
  title: 'Política de Privacidade & LGPD — Neruma Design',
  description: 'Conheça nosso compromisso ético e rigoroso com a segurança dos seus dados pessoais.',
  path: '/privacidade',
});

export default function PrivacidadePage() {
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        <div className="border-b border-white/10 pb-6 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Segurança & Transparência
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Política de Privacidade
          </h1>
          <p className="text-xs text-neruma-sand-400 mt-1 font-light">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </div>

        <div className="bg-[#1A1816] p-8 sm:p-12 rounded-organic border border-white/10 space-y-6 text-xs sm:text-sm text-neruma-sand-300 font-light leading-relaxed shadow-2xl">
          <h2 className="font-serif text-lg font-bold text-white">1. Coleta de Dados</h2>
          <p>
            Coletamos apenas as informações estritamente necessárias para a emissão de nota fiscal, faturamento de pedidos e entrega segura das peças através das transportadoras parceiras.
          </p>

          <h2 className="font-serif text-lg font-bold text-white pt-4">2. Uso e Compartilhamento</h2>
          <p>
            A Neruma não comercializa, não aluga e não transfere seus dados pessoais a terceiros para fins de marketing. Seus dados de pagamento são transmitidos sob criptografia ponta a ponta e processados diretamente pelos gateways autorizados (Mercado Pago / Banco Central).
          </p>

          <h2 className="font-serif text-lg font-bold text-white pt-4">3. Seus Direitos</h2>
          <p>
            Você pode solicitar a qualquer momento a confirmação da existência de tratamento, a alteração de dados cadastrais ou a exclusão definitiva da sua conta enviando um e-mail para <em>privacidade@neruma.com.br</em>.
          </p>
        </div>
      </Container>
    </div>
  );
}
