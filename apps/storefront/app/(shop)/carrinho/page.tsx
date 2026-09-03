import React from 'react';
import Link from 'next/link';
import { Container } from '../../../components/ui/Container.js';
import { Button } from '../../../components/ui/Button.js';
import { formatBRL } from '../../../lib/utils/formatters.js';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="py-12 pb-24">
      <Container size="lg">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neruma-dark mb-8">
          Sua Sacola de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-8 bg-neruma-sand-50 p-8 rounded-neruma border border-neruma-border">
            <div className="text-center py-12 space-y-4">
              <ShoppingBag className="w-12 h-12 text-neruma-muted mx-auto" />
              <h2 className="font-serif text-xl font-medium text-neruma-dark">
                Sua sacola está vazia
              </h2>
              <p className="text-xs text-neruma-muted max-w-sm mx-auto">
                Explore nossas coleções autorais e descubra peças biofílicas perfeitas para seu espaço.
              </p>
              <div className="pt-4">
                <Link href="/produtos">
                  <Button size="md" className="bg-neruma-dark text-white hover:bg-neruma-wood-dark">
                    Explorar Catálogo
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido & Checkout */}
          <div className="lg:col-span-4 bg-neruma-sand-100 p-6 rounded-neruma border border-neruma-border space-y-6">
            <h3 className="font-serif text-lg font-bold text-neruma-dark">
              Resumo do Pedido
            </h3>

            <div className="space-y-3 text-xs text-neruma-muted border-b border-neruma-border pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neruma-dark">{formatBRL(0, false)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete Estimado</span>
                <span>Calculado no checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-neruma-dark">
              <span>Total</span>
              <span>{formatBRL(0, false)}</span>
            </div>

            <Link href="/checkout" className="block">
              <Button size="lg" className="w-full bg-neruma-dark text-white hover:bg-neruma-wood-dark">
                Iniciar Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <div className="space-y-2 pt-2 text-[11px] text-neruma-muted">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-neruma-wood" />
                <span>Frete grátis para compras acima de R$ 500</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-neruma-wood" />
                <span>Pagamento 100% seguro via Pix ou Cartão</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
