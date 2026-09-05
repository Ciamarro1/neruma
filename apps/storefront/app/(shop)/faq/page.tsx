import React from 'react';
import Link from 'next/link';
import { Container } from '../../../components/ui/Container';
import { constructMetadata } from '../../../lib/seo/metadata';
import { HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Dúvidas Frequentes (FAQ) — Neruma Design',
  description:
    'Perguntas e respostas sobre prazos de confecção, cuidados com as fibras, envios protegidos e garantia.',
  path: '/faq',
});

const FAQS = [
  {
    q: 'Qual o prazo de confecção e entrega das peças?',
    a: 'Como nossas peças são 100% manuais e feitas sob encomenda para evitar desperdício de matéria-prima, o prazo de bancada varia de 5 a 8 dias úteis para tecelagem e marcenaria. O prazo de transporte (SEDEX) adiciona de 2 a 5 dias úteis dependendo do seu CEP.',
  },
  {
    q: 'As luminárias acompanham kit elétrico e lâmpada?',
    a: 'Sim, todas as luminárias pendentes Neruma são enviadas completas: bocal padrão E27 em aço carbono ou latão fosco, canopla de teto e cabo elétrico revestido em tecido de linho puro com 1,5m ajustável. A lâmpada de filamento LED branco quente (2400K) pode ser selecionada.',
  },
  {
    q: 'Como funciona a visualização 3D dos produtos?',
    a: 'Nossos produtos com selo [3D] possuem gêmeos digitais tridimensionais de alta precisão. Ao clicar no botão "Modelo 3D Interativo", você pode rotacionar a peça em 360°, dar zoom em cada nó do macramê e inspecionar os acabamentos em tempo real direto no seu navegador.',
  },
  {
    q: 'Como é feita a embalagem de transporte para peças frágeis?',
    a: 'Utilizamos exclusivamente caixas de papelão reforçado de parede dupla com enchimento de papel colmeia 100% biodegradável e livre de plástico. Nossos envios contam com seguro total contra danos durante o frete.',
  },
  {
    q: 'Como faço a manutenção e limpeza dos nós de macramê e do freijó?',
    a: 'Para o macramê, basta usar um espanador suave ou aspirador de pó com bocal fino em potência baixa. Para a madeira, recomendamos a aplicação de nossa cera botânica de abelha a cada 6 meses para manter a nutrição e o brilho acetinado natural.',
  },
  {
    q: 'Qual a garantia oferecida pela Neruma?',
    a: 'Oferecemos garantia estendida de 1 ano contra defeitos de fabricação na estrutura de marcenaria e tramas têxteis. Além disso, você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução integral caso a peça não harmonize perfeitamente com seu ambiente.',
  },
];

export default function FAQPage() {
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        {/* Cabeçalho */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light">
            Central de Informações
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Dúvidas Frequentes
          </h1>
          <p className="text-sm text-neruma-sand-400 font-light leading-relaxed">
            Tudo o que você precisa saber sobre o processo artesanal, envios cuidadosos e garantia.
          </p>
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#1A1816] p-6 sm:p-8 rounded-organic border border-white/10 space-y-3 hover:border-white/20 transition-all shadow-xl shadow-black/60"
            >
              <h3 className="font-serif text-lg font-bold text-white flex items-start gap-3">
                <span className="text-neruma-terracotta-light text-sm font-sans mt-0.5">0{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-neruma-sand-300 font-light leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Bloco de Atendimento */}
        <div className="mt-14 p-8 bg-[#1E1B18] rounded-organic border border-white/10 text-center space-y-4 shadow-2xl">
          <h4 className="font-serif text-xl font-bold text-white">Não encontrou a resposta?</h4>
          <p className="text-xs text-neruma-sand-400 font-light max-w-sm mx-auto">
            Nossa equipe de curadoria e mestres artesãos está à disposição para esclarecer qualquer detalhe técnico ou projeto sob medida.
          </p>
          <div className="pt-2">
            <Link
              href="/contato"
              className="inline-block px-7 py-3 rounded-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
