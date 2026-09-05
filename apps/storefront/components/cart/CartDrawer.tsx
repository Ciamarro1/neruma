'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { formatBRL } from '../../lib/utils/formatters';
import { Button } from '../ui/Button';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD_CENTS = 50000; // R$ 500,00

export const CartDrawer: React.FC = () => {
  const { items, totalCount, subtotal, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();

  // Travar o scroll do body quando o drawer estiver aberto
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop com blur escuro */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Painel Lateral */}
      <div className="relative w-full max-w-md bg-[#181614] border-l border-white/10 text-neruma-sand-100 flex flex-col h-full shadow-2xl shadow-black z-10">
        {/* Cabeçalho do Drawer */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neruma-terracotta-light" />
            <h2 className="font-serif text-lg font-bold text-white tracking-wide">
              Sua Sacola ({totalCount})
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 text-neruma-sand-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            aria-label="Fechar sacola"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progresso de Frete Grátis */}
        <div className="px-5 py-3 bg-[#1C1A17] border-b border-white/5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            {remainingForFreeShipping === 0 ? (
              <span className="text-neruma-olive-light font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis!
              </span>
            ) : (
              <span className="text-neruma-sand-300 font-light">
                Faltam <strong className="text-white font-semibold">{formatBRL(remainingForFreeShipping, true)}</strong> para Frete Grátis
              </span>
            )}
            <span className="text-[10px] text-neruma-sand-400 font-light">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                remainingForFreeShipping === 0 ? 'bg-neruma-olive' : 'bg-neruma-terracotta'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Conteúdo: Itens ou Vazio */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neruma-terracotta-light">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Sua sacola está vazia</h3>
              <p className="text-xs text-neruma-sand-400 font-light max-w-xs mx-auto leading-relaxed">
                Descubra luminárias orgânicas com visualização 3D e quadros artesanais feitos com fibras naturais.
              </p>
              <div className="pt-2">
                <Link href="/produtos" onClick={closeDrawer}>
                  <Button size="sm" className="bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white px-6">
                    Explorar Criações
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-neruma bg-[#141210] border border-white/5 hover:border-white/15 transition-all"
              >
                {/* Imagem do Produto */}
                <div className="relative w-20 h-20 rounded-neruma overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Detalhes do Item */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/produto/${item.handle}`}
                      onClick={closeDrawer}
                      className="font-serif text-xs font-semibold text-white hover:text-neruma-terracotta-light transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neruma-sand-400/50 hover:text-red-400 transition-colors p-1"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-white">
                    {formatBRL(item.price, true)}
                  </p>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-white/15 rounded-full bg-[#181614] px-2 py-0.5 space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-neruma-sand-300 hover:text-white p-0.5"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-neruma-sand-300 hover:text-white p-0.5"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-medium text-neruma-sand-200">
                      Total: {formatBRL(item.price * item.quantity, true)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé com Totais e Ações */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#141210] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neruma-sand-300 font-light">
                <span>Subtotal</span>
                <span className="text-white font-bold text-sm">{formatBRL(subtotal, true)}</span>
              </div>
              <div className="flex justify-between text-neruma-sand-400 font-light">
                <span>Frete</span>
                <span>{remainingForFreeShipping === 0 ? <strong className="text-neruma-olive-light">GRÁTIS</strong> : 'Calculado no checkout'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link href="/checkout" onClick={closeDrawer} className="block">
                <Button
                  size="lg"
                  className="w-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold py-3.5 shadow-xl shadow-neruma-terracotta/30 flex items-center justify-center gap-2"
                >
                  <span>Finalizar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/carrinho" onClick={closeDrawer} className="block text-center">
                <span className="text-xs text-neruma-sand-300 hover:text-white underline underline-offset-4 transition-colors font-light">
                  Ver Sacola Completa
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neruma-sand-400/60 font-light pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neruma-olive-light" />
              <span>Checkout 100% Criptografado • Pix com 5% OFF</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
