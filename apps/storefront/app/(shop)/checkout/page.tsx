'use client';

import React, { useState } from 'react';
import { Container } from '../../../components/ui/Container.js';
import { Button } from '../../../components/ui/Button.js';
import { formatBRL } from '../../../lib/utils/formatters.js';
import { ShieldCheck, Lock, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState<'identification' | 'shipping' | 'payment' | 'confirmation'>('identification');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');

  return (
    <div className="py-12 pb-24 bg-neruma-sand-50">
      <Container size="md">
        <div className="flex items-center justify-between border-b border-neruma-border pb-6 mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neruma-dark">
              Finalização de Compra
            </h1>
            <p className="text-xs text-neruma-muted mt-1">Ambiente Criptografado & Seguro</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neruma-olive font-medium">
            <Lock className="w-4 h-4" />
            <span>SSL 256-bit</span>
          </div>
        </div>

        {/* Steps Breadcrumb */}
        <div className="flex items-center justify-between mb-10 text-xs uppercase tracking-wider font-semibold">
          <span className={step === 'identification' ? 'text-neruma-dark border-b-2 border-neruma-dark pb-1' : 'text-neruma-muted'}>
            1. Identificação
          </span>
          <span className="text-neruma-border">/</span>
          <span className={step === 'shipping' ? 'text-neruma-dark border-b-2 border-neruma-dark pb-1' : 'text-neruma-muted'}>
            2. Endereço & Frete
          </span>
          <span className="text-neruma-border">/</span>
          <span className={step === 'payment' ? 'text-neruma-dark border-b-2 border-neruma-dark pb-1' : 'text-neruma-muted'}>
            3. Pagamento
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Formulário Principal */}
          <div className="md:col-span-8 bg-white p-8 rounded-neruma border border-neruma-border space-y-6 shadow-card">
            {step === 'identification' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-neruma-dark">Dados Pessoais</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">Nome</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">Sobrenome</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">CPF</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">WhatsApp / Celular</label>
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button size="lg" onClick={() => setStep('shipping')} className="w-full bg-neruma-dark text-white">
                    Continuar para Entrega
                  </Button>
                </div>
              </div>
            )}

            {step === 'shipping' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-neruma-dark">Endereço de Entrega</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">CEP</label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">Rua / Logradouro</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">Número</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neruma-border space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neruma-dark">
                    Opções de Frete (Melhor Envio)
                  </h4>
                  <label className="flex items-center justify-between p-3 border border-neruma-dark rounded-neruma cursor-pointer bg-neruma-sand-100">
                    <div>
                      <p className="text-xs font-bold text-neruma-dark">Correios SEDEX (Expresso)</p>
                      <p className="text-[11px] text-neruma-muted">Entrega em até 3 dias úteis</p>
                    </div>
                    <span className="text-xs font-bold text-neruma-dark">{formatBRL(2850, true)}</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="outline" onClick={() => setStep('identification')}>
                    Voltar
                  </Button>
                  <Button size="lg" onClick={() => setStep('payment')} className="flex-1 bg-neruma-dark text-white">
                    Ir para Pagamento
                  </Button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-bold text-neruma-dark">Forma de Pagamento</h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 border rounded-neruma text-center space-y-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-neruma-dark bg-neruma-sand-100 font-semibold'
                        : 'border-neruma-border hover:bg-neruma-sand-50'
                    }`}
                  >
                    <QrCode className="w-6 h-6 mx-auto text-neruma-terracotta" />
                    <span className="block text-xs uppercase tracking-wider">Pix Instantâneo (5% OFF)</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 border rounded-neruma text-center space-y-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-neruma-dark bg-neruma-sand-100 font-semibold'
                        : 'border-neruma-border hover:bg-neruma-sand-50'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto text-neruma-wood" />
                    <span className="block text-xs uppercase tracking-wider">Cartão de Crédito</span>
                  </button>
                </div>

                {paymentMethod === 'pix' ? (
                  <div className="p-4 bg-neruma-sand-100 rounded-neruma border border-neruma-border text-center space-y-2">
                    <p className="text-xs text-neruma-charcoal">
                      O QR Code e a chave Copia e Cola serão gerados imediatamente após clicar em concluir.
                    </p>
                    <p className="text-[11px] text-neruma-muted">Aprovação imediata do pedido.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-neruma-charcoal mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2.5 text-sm border border-neruma-border rounded-neruma focus:outline-none focus:border-neruma-dark"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <Button variant="outline" onClick={() => setStep('shipping')}>
                    Voltar
                  </Button>
                  <Button size="lg" className="flex-1 bg-neruma-dark text-white hover:bg-neruma-wood-dark">
                    Concluir Pedido
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumo Lateral */}
          <div className="md:col-span-4 bg-neruma-sand-100 p-6 rounded-neruma border border-neruma-border space-y-4">
            <h4 className="font-serif text-base font-bold text-neruma-dark">Resumo</h4>
            <div className="text-xs space-y-2 text-neruma-muted border-b border-neruma-border pb-3">
              <div className="flex justify-between">
                <span>Itens</span>
                <span className="font-medium text-neruma-dark">{formatBRL(89000, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete (SEDEX)</span>
                <span className="font-medium text-neruma-dark">{formatBRL(2850, true)}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-bold text-neruma-dark">
              <span>Total</span>
              <span>{formatBRL(91850, true)}</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
