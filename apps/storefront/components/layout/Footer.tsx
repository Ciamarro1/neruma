import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { ShieldCheck, Truck, Sparkles, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#100F0E] text-neruma-sand-100 border-t border-white/10">
      {/* Brand Values Banner */}
      <div className="border-b border-white/5 bg-[#141210] py-14">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start p-4 rounded-organic bg-[#1A1816]/40 border border-white/5">
              <Sparkles className="w-7 h-7 text-neruma-terracotta-light mb-3" />
              <h4 className="font-serif text-base font-semibold text-white mb-1.5">100% Feito à Mão</h4>
              <p className="text-xs text-neruma-sand-400/80 leading-relaxed">Cada peça carrega a alma e o tempo do artesão brasileiro.</p>
            </div>
            <div className="flex flex-col items-center md:items-start p-4 rounded-organic bg-[#1A1816]/40 border border-white/5">
              <ShieldCheck className="w-7 h-7 text-neruma-terracotta-light mb-3" />
              <h4 className="font-serif text-base font-semibold text-white mb-1.5">Madeira Sustentável</h4>
              <p className="text-xs text-neruma-sand-400/80 leading-relaxed">Apenas Freijó e Cumaru de manejo florestal sustentável.</p>
            </div>
            <div className="flex flex-col items-center md:items-start p-4 rounded-organic bg-[#1A1816]/40 border border-white/5">
              <Truck className="w-7 h-7 text-neruma-terracotta-light mb-3" />
              <h4 className="font-serif text-base font-semibold text-white mb-1.5">Embalagem Segura</h4>
              <p className="text-xs text-neruma-sand-400/80 leading-relaxed">Proteção antichoque reforçada e livre de plásticos.</p>
            </div>
            <div className="flex flex-col items-center md:items-start p-4 rounded-organic bg-[#1A1816]/40 border border-white/5">
              <RefreshCw className="w-7 h-7 text-neruma-terracotta-light mb-3" />
              <h4 className="font-serif text-base font-semibold text-white mb-1.5">Garantia Ateliê</h4>
              <p className="text-xs text-neruma-sand-400/80 leading-relaxed">1 ano de garantia direta com nossos mestres artesãos.</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white block mb-4">
                NERUMA
              </span>
              <p className="text-sm text-neruma-sand-300/80 max-w-sm mb-6 leading-relaxed font-light">
                Transformando lares através da união entre o design biofílico contemporâneo e as tradições ancestrais da madeira nobre e das fibras naturais.
              </p>
              <p className="text-xs text-neruma-sand-400/60 font-light">
                Ateliê São Paulo | CNPJ: 00.000.000/0001-00
              </p>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">Loja</h5>
              <ul className="space-y-2.5 text-sm text-neruma-sand-400 font-light">
                <li><Link href="/colecoes" className="hover:text-white transition-colors">Coleções</Link></li>
                <li><Link href="/categorias/quadros-e-paineis" className="hover:text-white transition-colors">Quadros & Painéis</Link></li>
                <li><Link href="/categorias/luminarias-organicas" className="hover:text-white transition-colors">Luminárias</Link></li>
                <li><Link href="/categorias/mobiliario-pet" className="hover:text-white transition-colors">Espaço Pet</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">Editorial</h5>
              <ul className="space-y-2.5 text-sm text-neruma-sand-400 font-light">
                <li><Link href="/lookbooks" className="hover:text-white transition-colors">Lookbooks</Link></li>
                <li><Link href="/historias" className="hover:text-white transition-colors">Histórias de Criação</Link></li>
                <li><Link href="/sobre" className="hover:text-white transition-colors">O Manifesto Neruma</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">Atendimento</h5>
              <ul className="space-y-2.5 text-sm text-neruma-sand-400 font-light">
                <li><Link href="/faq" className="hover:text-white transition-colors">Dúvidas Frequentes</Link></li>
                <li><Link href="/envios" className="hover:text-white transition-colors">Prazos & Entregas</Link></li>
                <li><Link href="/contato" className="hover:text-white transition-colors">Fale com o Ateliê</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neruma-sand-400/60 font-light">
            <p>© {new Date().getFullYear()} Neruma Design Orgânico. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
