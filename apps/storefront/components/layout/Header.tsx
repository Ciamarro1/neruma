'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { Container } from '../ui/Container';
import { useCart } from '../../context/CartContext';

export const Header: React.FC = () => {
  const { totalCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#141210]/95 backdrop-blur-md border-b border-white/10 text-white transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-black/90 text-neruma-sand-300/80 border-b border-white/5 py-1.5 px-4 text-center text-xs tracking-wider uppercase font-medium">
        Frete Grátis acima de R$ 500 para todo o Brasil | Feito à Mão sob Encomenda
      </div>

      <Container size="lg">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="p-2 text-white hover:text-neruma-terracotta-light transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-center group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] uppercase text-white group-hover:text-neruma-sand-200 transition-colors">
                Neruma
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neruma-sand-400 font-light -mt-1">
                Design Orgânico
              </span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-widest font-medium text-neruma-sand-300">
            <Link
              href="/colecoes"
              className="hover:text-white transition-colors"
            >
              Coleções
            </Link>
            <Link
              href="/produtos"
              className="hover:text-white transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/categorias/quadros-e-paineis"
              className="hover:text-white transition-colors"
            >
              Quadros & Painéis
            </Link>
            <Link
              href="/categorias/luminarias-organicas"
              className="hover:text-white transition-colors"
            >
              Luminárias
            </Link>
            <Link
              href="/lookbooks"
              className="hover:text-white transition-colors"
            >
              Lookbooks
            </Link>
            <Link
              href="/historias"
              className="hover:text-white transition-colors"
            >
              Editorial
            </Link>
          </nav>

          {/* User & Cart Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-neruma-sand-200">
            <Link
              href="/busca"
              className="p-2 hover:text-white transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              className="p-2 hover:text-white transition-colors relative cursor-pointer"
              aria-label="Abrir Sacola de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 bg-neruma-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md shadow-neruma-terracotta/40">
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};
