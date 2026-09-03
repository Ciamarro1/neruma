import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, Heart } from 'lucide-react';
import { Container } from '../ui/Container.js';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-neruma-bg/95 backdrop-blur-md border-b border-neruma-border">
      {/* Top Banner */}
      <div className="bg-neruma-dark text-neruma-sand-100 py-1.5 px-4 text-center text-xs tracking-wider uppercase font-medium">
        Frete Grátis acima de R$ 500 para todo o Brasil | Feito à Mão sob Encomenda
      </div>

      <Container size="lg">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="p-2 text-neruma-dark hover:text-neruma-wood"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-center group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neruma-dark group-hover:text-neruma-wood transition-colors">
                NERUMA
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neruma-muted">
                Design Orgânico
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-wider font-medium text-neruma-charcoal">
            <Link href="/colecoes" className="hover:text-neruma-wood transition-colors">
              Coleções
            </Link>
            <Link href="/categorias/quadros-e-paineis" className="hover:text-neruma-wood transition-colors">
              Quadros
            </Link>
            <Link href="/categorias/luminarias-organicas" className="hover:text-neruma-wood transition-colors">
              Luminárias
            </Link>
            <Link href="/categorias/mobiliario-pet" className="hover:text-neruma-wood transition-colors">
              Linha Pet
            </Link>
            <Link href="/lookbooks" className="hover:text-neruma-wood transition-colors text-neruma-terracotta">
              Lookbooks
            </Link>
            <Link href="/historias" className="hover:text-neruma-wood transition-colors">
              Editorial
            </Link>
          </nav>

          {/* User & Cart Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-neruma-dark">
            <Link href="/busca" className="p-2 hover:text-neruma-wood transition-colors" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/carrinho" className="p-2 hover:text-neruma-wood transition-colors relative" aria-label="Carrinho">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-neruma-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};
