import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container.js';
import { ShieldCheck, Truck, Sparkles, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neruma-charcoal text-neruma-sand-100 border-t border-neruma-wood-dark">
      {/* Brand Values Banner */}
      <div className="border-b border-neruma-charcoal/40 bg-neruma-dark py-12">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <Sparkles className="w-8 h-8 text-neruma-sand-300 mb-3" />
              <h4 className="font-serif text-lg font-semibold text-white mb-1">100% Feito à Mão</h4>
              <p className="text-xs text-neruma-sand-300">Cada peça carrega a alma e o tempo do artesão brasileiro.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <ShieldCheck className="w-8 h-8 text-neruma-sand-300 mb-3" />
              <h4 className="font-serif text-lg font-semibold text-white mb-1">Madeira Sustentável</h4>
              <p className="text-xs text-neruma-sand-300">Apenas Freijó e Cumaru de manejo florestal certificado.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <Truck className="w-8 h-8 text-neruma-sand-300 mb-3" />
              <h4 className="font-serif text-lg font-semibold text-white mb-1">Embalagem Segura</h4>
              <p className="text-xs text-neruma-sand-300">Proteção antichoque reforçada para peças de grande porte.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <RefreshCw className="w-8 h-8 text-neruma-sand-300 mb-3" />
              <h4 className="font-serif text-lg font-semibold text-white mb-1">Garantia Ateliê</h4>
              <p className="text-xs text-neruma-sand-300">Acompanhamento e suporte direto com quem produz.</p>
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
              <p className="text-sm text-neruma-sand-300 max-w-sm mb-6 leading-relaxed">
                Transformando lares através da união entre o design biofílico contemporâneo e as tradições ancestrais da madeira nobre e das fibras naturais.
              </p>
              <p className="text-xs text-neruma-sand-400">
                Ateliê São Paulo | CNPJ: 00.000.000/0001-00
              </p>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">Loja</h5>
              <ul className="space-y-2 text-sm text-neruma-sand-300">
                <li><Link href="/colecoes" className="hover:text-white transition-colors">Coleções</Link></li>
                <li><Link href="/categorias/quadros-e-paineis" className="hover:text-white transition-colors">Quadros & Painéis</Link></li>
                <li><Link href="/categorias/luminarias-organicas" className="hover:text-white transition-colors">Luminárias</Link></li>
                <li><Link href="/categorias/mobiliario-pet" className="hover:text-white transition-colors">Espaço Pet</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">Editorial</h5>
              <ul className="space-y-2 text-sm text-neruma-sand-300">
                <li><Link href="/lookbooks" className="hover:text-white transition-colors">Lookbooks Interativos</Link></li>
                <li><Link href="/ambientes" className="hover:text-white transition-colors">Inspiração por Ambiente</Link></li>
                <li><Link href="/historias" className="hover:text-white transition-colors">Histórias de Ateliê</Link></li>
                <li><Link href="/guias" className="hover:text-white transition-colors">Guia de Cuidados</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">Atendimento</h5>
              <ul className="space-y-2 text-sm text-neruma-sand-300">
                <li><a href="mailto:contato@neruma.com.br" className="hover:text-white transition-colors">contato@neruma.com.br</a></li>
                <li><span className="block text-xs text-neruma-sand-400 mt-1">Seg a Sex das 09h às 18h</span></li>
                <li className="pt-2"><Link href="/faq" className="hover:text-white transition-colors">Dúvidas Frequentes</Link></li>
                <li><Link href="/politica-de-privacidade" className="hover:text-white transition-colors">Privacidade & Termos</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-neruma-wood/30 flex flex-col sm:flex-row items-center justify-between text-xs text-neruma-sand-400">
            <p>© {new Date().getFullYear()} Neruma Design Orgânico. Todos os direitos reservados.</p>
            <p className="mt-4 sm:mt-0">100% Infraestrutura Própria & Soberana</p>
          </div>
        </Container>
      </div>
    </footer>
  );
};
