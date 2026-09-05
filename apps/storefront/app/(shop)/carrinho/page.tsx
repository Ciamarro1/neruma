'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { useCart } from '../../../context/CartContext';
import { formatBRL } from '../../../lib/utils/formatters';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD_CENTS = 50000; // R$ 500,00

export default function CartPage() {
  const { items, totalCount, subtotal, updateQuantity, removeItem } = useCart();

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = isFreeShipping || subtotal === 0 ? 0 : 2850;
  const totalCents = subtotal + shippingCents;
  const pixDiscountCents = Math.round(totalCents * 0.05);
  const pixTotalCents = totalCents - pixDiscountCents;

  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        <div className="border-b border-white/10 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
              Seu Pedido
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Sua Sacola de Compras
            </h1>
          </div>
          {totalCount > 0 && (
            <span className="text-xs text-neruma-sand-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
              {totalCount} {totalCount === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          /* Estado Vazio */
          <div className="max-w-2xl mx-auto bg-[#1A1816] p-8 sm:p-14 rounded-organic border border-white/10 shadow-2xl shadow-black/80 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-neruma-terracotta-light">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-white">
              Sua sacola está vazia
            </h2>
            <p className="text-sm text-neruma-sand-400 max-w-md mx-auto font-light leading-relaxed">
              Explore nosso acervo autoral e descubra luminárias com modelos 3D interativos e quadros botânicos perfeitos para transformar seu espaço.
            </p>
            <div className="pt-4">
              <Link href="/produtos">
                <Button size="md" className="bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white px-8 py-3 shadow-lg shadow-neruma-terracotta/20">
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Tabela de Itens e Resumo */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Lista de Itens */}
            <div className="lg:col-span-8 bg-[#1A1816] p-6 sm:p-8 rounded-organic border border-white/10 shadow-2xl shadow-black/60 space-y-6">
              <div className="divide-y divide-white/10">
                {items.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* Imagem */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-organic overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-neruma-terracotta-light font-medium">
                        Feito à Mão
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white hover:text-neruma-sand-200 transition-colors">
                        <Link href={`/produto/${item.handle}`}>{item.title}</Link>
                      </h3>
                      <p className="text-xs text-neruma-sand-400 font-light">
                        Preço unitário: {formatBRL(item.price, true)}
                      </p>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center border border-white/15 rounded-full bg-[#141210] px-3 py-1 space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-neruma-sand-300 hover:text-white p-0.5"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-neruma-sand-300 hover:text-white p-0.5"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">
                          {formatBRL(item.price * item.quantity, true)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neruma-sand-400/60 hover:text-red-400 p-1 transition-colors"
                          aria-label="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ação de Continuar Comprando */}
              <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                <Link
                  href="/produtos"
                  className="text-xs text-neruma-sand-300 hover:text-white flex items-center gap-2 font-light transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continuar Comprando</span>
                </Link>
                <button
                  onClick={() => items.forEach((it) => removeItem(it.id))}
                  className="text-xs text-neruma-sand-400/60 hover:text-red-400 transition-colors font-light"
                >
                  Limpar Sacola
                </button>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-4 bg-[#1E1B18] p-7 rounded-organic border border-white/10 space-y-6 shadow-2xl shadow-black/60">
              <h3 className="font-serif text-xl font-bold text-white">
                Resumo do Pedido
              </h3>

              {/* Barra de Frete Grátis */}
              <div className="p-3.5 bg-[#141210] rounded-neruma border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  {isFreeShipping ? (
                    <span className="text-neruma-olive-light font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Frete Grátis Qualificado!
                    </span>
                  ) : (
                    <span className="text-neruma-sand-300 font-light">
                      Faltam <strong className="text-white">{formatBRL(FREE_SHIPPING_THRESHOLD_CENTS - subtotal, true)}</strong> para frete grátis
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFreeShipping ? 'bg-neruma-olive' : 'bg-neruma-terracotta'
                    }`}
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_CENTS) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Detalhamento de Valores */}
              <div className="space-y-3.5 text-xs text-neruma-sand-300/80 border-b border-white/10 pb-5 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatBRL(subtotal, true)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frete (SEDEX Especial)</span>
                  <span className="font-semibold text-white">
                    {shippingCents === 0 ? (
                      <span className="text-neruma-olive-light font-bold uppercase">Grátis</span>
                    ) : (
                      formatBRL(shippingCents, true)
                    )}
                  </span>
                </div>
              </div>

              {/* Total do Pedido */}
              <div className="space-y-1">
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>{formatBRL(totalCents, true)}</span>
                </div>
                <div className="flex justify-between text-xs text-neruma-terracotta-light">
                  <span>No Pix (5% OFF)</span>
                  <span className="font-bold">{formatBRL(pixTotalCents, true)}</span>
                </div>
              </div>

              {/* CTA Checkout */}
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold py-3.5 shadow-lg shadow-neruma-terracotta/30 flex items-center justify-center gap-2">
                  <span>Finalizar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {/* Badges de Confiança */}
              <div className="space-y-3 pt-2 text-[11px] text-neruma-sand-400/70 font-light border-t border-white/5">
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-4 h-4 text-neruma-terracotta-light" />
                  <span>Embalagem reforçada colmeia antichoque</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-neruma-terracotta-light" />
                  <span>Garantia de 1 ano & devolução sem custo em até 7 dias</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
