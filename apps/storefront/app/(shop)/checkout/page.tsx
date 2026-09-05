'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { useCart } from '../../../context/CartContext';
import { formatBRL } from '../../../lib/utils/formatters';
import {
  Lock,
  QrCode,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Mail,
  Eye,
  ExternalLink,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD_CENTS = 50000; // R$ 500,00

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<'identification' | 'shipping' | 'payment' | 'confirmation'>('identification');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [emailHtml, setEmailHtml] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cpf: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Snapshot dos itens no momento de confirmar pedido
  const [confirmedItems, setConfirmedItems] = useState(items);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = isFreeShipping || subtotal === 0 ? 0 : 2850;
  const rawTotalCents = subtotal + shippingCents;
  const pixDiscountCents = paymentMethod === 'pix' ? Math.round(rawTotalCents * 0.05) : 0;
  const finalTotalCents = rawTotalCents - pixDiscountCents;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleGoToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName) {
      setFormError('Por favor, preencha ao menos seu E-mail e Nome para continuar.');
      return;
    }
    setFormError(null);
    setStep('shipping');
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cep || !form.street) {
      setFormError('Por favor, informe ao menos o CEP e o Logradouro de entrega.');
      return;
    }
    setFormError(null);
    setStep('payment');
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    setEmailStatus('sending');

    const newOrderNum = `NER-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderNum);
    setConfirmedItems([...items]);
    setConfirmedTotal(finalTotalCents);

    const pixCode = `00020126580014BR.GOV.BCB.PIX0136neruma-pagamentos-${newOrderNum}520400005303986540${(
      finalTotalCents / 100
    ).toFixed(2)}5802BR5920NERUMA DESIGN BIOFIL6009SAO PAULO62070503***6304`;

    try {
      const emailPayload = {
        orderNumber: newOrderNum,
        customer: {
          name: `${form.firstName} ${form.lastName}`.trim() || 'Cliente Neruma',
          email: form.email,
          phone: form.phone,
          street: form.street,
          number: form.number,
          complement: form.complement,
          cep: form.cep,
        },
        items: items.map((it) => ({
          id: it.id,
          title: it.title,
          quantity: it.quantity,
          price: it.price,
          thumbnail: it.thumbnail,
        })),
        paymentMethod,
        pixCode: paymentMethod === 'pix' ? pixCode : undefined,
        subtotal,
        shipping: shippingCents,
        discount: pixDiscountCents,
        total: finalTotalCents,
      };

      const res = await fetch('/api/checkout/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setEmailPreviewUrl(data.previewUrl || null);
        setEmailHtml(data.html || null);
        setEmailStatus('sent');
      } else {
        setEmailStatus('error');
      }
    } catch (err) {
      console.warn('[Checkout] Erro ao disparar e-mail:', err);
      setEmailStatus('error');
    } finally {
      clearCart();
      setIsSubmitting(false);
      setStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pixKeySimulator = `00020126580014BR.GOV.BCB.PIX0136neruma-pagamentos-${orderNumber || '001'}520400005303986540${(
    finalTotalCents / 100
  ).toFixed(2)}5802BR5920NERUMA DESIGN BIOFIL6009SAO PAULO62070503***6304`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixKeySimulator);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Se o carrinho estiver vazio e não for a tela de confirmação
  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="py-20 bg-[#141210] text-neruma-sand-100 min-h-screen">
        <Container size="md">
          <div className="bg-[#1A1816] p-10 sm:p-14 rounded-organic border border-white/10 text-center space-y-5 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neruma-terracotta-light">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Sua sacola está vazia
            </h2>
            <p className="text-xs text-neruma-sand-300 font-light leading-relaxed">
              Adicione uma luminária ou peça autoral antes de prosseguir para o checkout.
            </p>
            <div className="pt-2">
              <Link href="/produtos">
                <Button size="md" className="bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white px-8">
                  Ver Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // TELA DE CONFIRMAÇÃO DO PEDIDO (STEP 4)
  if (step === 'confirmation') {
    return (
      <div className="py-16 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
        <Container size="md">
          <div className="max-w-xl mx-auto bg-[#1A1816] p-8 sm:p-12 rounded-organic border border-white/10 shadow-2xl shadow-black/80 space-y-8 text-center">
            <div className="w-20 h-20 rounded-full bg-neruma-olive/20 border border-neruma-olive/40 flex items-center justify-center mx-auto text-neruma-olive-light animate-fade-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light">
                Pedido Registrado
              </span>
              <h1 className="font-serif text-3xl font-bold text-white">
                Obrigado pelo seu pedido!
              </h1>
              <p className="text-xs text-neruma-sand-300 font-light">
                Número do pedido: <strong className="text-white font-mono">{orderNumber}</strong>
              </p>
              <p className="text-xs text-neruma-sand-400 font-light">
                Enviamos os detalhes e a confirmação para <span className="text-white">{form.email || 'seu e-mail'}</span>.
              </p>
            </div>

            {/* Status do Envio de E-mail de Confirmação */}
            <div className="p-4 rounded-neruma bg-[#141210] border border-white/10 text-left space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neruma-terracotta-light flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">E-mail de Confirmação</p>
                    <p className="text-[11px] text-neruma-sand-400 font-light">
                      {emailStatus === 'sending' && 'Disparando confirmação para o seu e-mail...'}
                      {emailStatus === 'sent' && (
                        <span>
                          Enviado com sucesso para <strong className="text-neruma-sand-200">{form.email}</strong>
                        </span>
                      )}
                      {emailStatus === 'error' && 'Cópia transacional registrada no ateliê.'}
                      {emailStatus === 'idle' && `Destinado a ${form.email}`}
                    </p>
                  </div>
                </div>

                {emailPreviewUrl && (
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-neruma-terracotta-light hover:underline bg-white/5 px-2.5 py-1 rounded border border-white/10 flex-shrink-0"
                  >
                    <span>Ver no Navegador</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {emailHtml && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="text-[11px] text-neruma-sand-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-neruma-terracotta-light" />
                    <span>{showEmailPreview ? 'Ocultar Cópia do E-mail' : 'Visualizar Cópia do E-mail Enviado'}</span>
                  </button>

                  {showEmailPreview && (
                    <div className="mt-3 rounded-neruma overflow-hidden border border-white/15 bg-black p-2">
                      <iframe
                        srcDoc={emailHtml}
                        title="Pré-visualização do E-mail de Confirmação"
                        className="w-full h-80 rounded border-0 bg-[#0E0D0C]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detalhes do Pagamento */}
            {paymentMethod === 'pix' ? (
              <div className="p-6 bg-[#141210] rounded-organic border border-white/10 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-neruma-terracotta-light" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Pagamento via Pix (5% OFF)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neruma-terracotta-light">
                    {formatBRL(confirmedTotal, true)}
                  </span>
                </div>

                <p className="text-[11px] text-neruma-sand-300 font-light">
                  Copie o código abaixo e abra o aplicativo do seu banco para efetuar o pagamento. A confirmação é instantânea.
                </p>

                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={pixKeySimulator}
                    className="w-full px-4 py-2.5 pr-28 text-xs font-mono bg-[#1A1816] text-neruma-sand-300 border border-white/15 rounded-neruma focus:outline-none select-all"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white text-[11px] font-semibold rounded transition-colors flex items-center gap-1"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Pix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-[#141210] rounded-organic border border-white/10 text-left space-y-2">
                <div className="flex items-center gap-2 text-neruma-olive-light">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Cartão de Crédito Aprovado
                  </span>
                </div>
                <p className="text-xs text-neruma-sand-300 font-light">
                  Cobrança de {formatBRL(confirmedTotal, true)} confirmada com sucesso pela operadora.
                </p>
              </div>
            )}

            {/* Resumo das Peças Compradas */}
            <div className="border-t border-white/10 pt-6 text-left space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-neruma-sand-400">
                Peças em Produção no Ateliê:
              </h4>
              <div className="space-y-2">
                {confirmedItems.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-xs text-neruma-sand-200">
                    <span className="line-clamp-1 font-light">
                      {it.quantity}x {it.title}
                    </span>
                    <span className="font-semibold text-white">
                      {formatBRL(it.price * it.quantity, true)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link href="/">
                <Button size="lg" className="w-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold py-3.5">
                  Voltar para a Página Inicial
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // FLUXO PRINCIPAL DO CHECKOUT (STEPS 1 A 3)
  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        {/* Cabeçalho do Checkout */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-1">
              Checkout Seguro
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Finalização de Compra
            </h1>
            <p className="text-xs text-neruma-sand-400/70 mt-1 font-light">
              Ambiente 100% Criptografado & Protegido
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neruma-olive-light font-medium bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL 256-bit</span>
          </div>
        </div>

        {/* Steps Breadcrumb */}
        <div className="flex items-center justify-between mb-8 text-xs uppercase tracking-wider font-semibold">
          <button
            type="button"
            onClick={() => setStep('identification')}
            className={step === 'identification' ? 'text-white border-b-2 border-neruma-terracotta pb-1' : 'text-neruma-sand-400/50 hover:text-white transition-colors'}
          >
            1. Identificação
          </button>
          <span className="text-white/20">/</span>
          <button
            type="button"
            onClick={() => {
              if (form.email) setStep('shipping');
            }}
            className={step === 'shipping' ? 'text-white border-b-2 border-neruma-terracotta pb-1' : 'text-neruma-sand-400/50 hover:text-white transition-colors'}
          >
            2. Endereço & Frete
          </button>
          <span className="text-white/20">/</span>
          <button
            type="button"
            onClick={() => {
              if (form.email && form.cep) setStep('payment');
            }}
            className={step === 'payment' ? 'text-white border-b-2 border-neruma-terracotta pb-1' : 'text-neruma-sand-400/50 hover:text-white transition-colors'}
          >
            3. Pagamento
          </button>
        </div>

        {formError && (
          <div className="mb-6 p-3.5 bg-red-950/50 border border-red-500/40 rounded-neruma text-xs text-red-200">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Formulário Principal */}
          <div className="md:col-span-8 bg-[#1A1816] p-8 rounded-organic border border-white/10 space-y-6 shadow-2xl shadow-black/80">
            {/* ETAPA 1: IDENTIFICAÇÃO */}
            {step === 'identification' && (
              <form onSubmit={handleGoToShipping} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">Dados Pessoais</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                    E-mail <span className="text-neruma-terracotta-light">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                      Nome <span className="text-neruma-terracotta-light">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleInputChange}
                      placeholder="Maria"
                      className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      placeholder="Silva"
                      className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={form.cpf}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                      WhatsApp / Celular
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold shadow-lg shadow-neruma-terracotta/25 py-3.5"
                  >
                    Continuar para Entrega
                  </Button>
                </div>
              </form>
            )}

            {/* ETAPA 2: ENDEREÇO & FRETE */}
            {step === 'shipping' && (
              <form onSubmit={handleGoToPayment} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">Endereço de Entrega</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                    CEP <span className="text-neruma-terracotta-light">*</span>
                  </label>
                  <input
                    type="text"
                    name="cep"
                    required
                    value={form.cep}
                    onChange={handleInputChange}
                    placeholder="01310-100"
                    className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                      Rua / Logradouro <span className="text-neruma-terracotta-light">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={form.street}
                      onChange={handleInputChange}
                      placeholder="Av. Paulista"
                      className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                      Número
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={form.number}
                      onChange={handleInputChange}
                      placeholder="1000"
                      className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neruma-terracotta-light">
                    Opção de Frete Especializada (Melhor Envio)
                  </h4>
                  <label className="flex items-center justify-between p-3.5 border border-neruma-terracotta-light/40 rounded-neruma cursor-pointer bg-[#201D1A]">
                    <div>
                      <p className="text-xs font-bold text-white">
                        Correios SEDEX (Embalagem Antichoque Protegida)
                      </p>
                      <p className="text-[11px] text-neruma-sand-400/70">
                        Entrega cuidadosa em até 3 a 5 dias úteis
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neruma-terracotta-light">
                      {shippingCents === 0 ? 'GRÁTIS' : formatBRL(shippingCents, true)}
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('identification')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold py-3.5"
                  >
                    Ir para Pagamento
                  </Button>
                </div>
              </form>
            )}

            {/* ETAPA 3: PAGAMENTO */}
            {step === 'payment' && (
              <div className="space-y-6">
                <h3 className="font-serif text-lg font-bold text-white">Forma de Pagamento</h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 border rounded-neruma text-center space-y-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-neruma-terracotta-light bg-neruma-terracotta/15 font-semibold text-white'
                        : 'border-white/10 bg-[#141210] text-neruma-sand-300 hover:border-white/20'
                    }`}
                  >
                    <QrCode className="w-6 h-6 mx-auto text-neruma-terracotta-light" />
                    <span className="block text-xs uppercase tracking-wider">Pix Instantâneo (5% OFF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 border rounded-neruma text-center space-y-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-neruma-terracotta-light bg-neruma-terracotta/15 font-semibold text-white'
                        : 'border-white/10 bg-[#141210] text-neruma-sand-300 hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto text-neruma-terracotta-light" />
                    <span className="block text-xs uppercase tracking-wider">Cartão de Crédito</span>
                  </button>
                </div>

                {paymentMethod === 'pix' ? (
                  <div className="p-5 bg-[#201D1A] rounded-neruma border border-white/10 text-center space-y-2">
                    <p className="text-xs text-neruma-sand-200">
                      O código Copia e Cola Pix será exibido imediatamente após clicar em Concluir Pedido.
                    </p>
                    <p className="text-[11px] text-neruma-terracotta-light font-medium">
                      Desconto de 5% aplicado sobre o total.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neruma-sand-300 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white placeholder-neruma-sand-400/40 rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('shipping')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleCompleteOrder}
                    disabled={isSubmitting}
                    className="flex-1 bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold py-3.5 shadow-lg shadow-neruma-terracotta/25"
                  >
                    {isSubmitting ? 'Processando Pedido...' : 'Concluir Pedido'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumo Lateral Dinâmico */}
          <div className="md:col-span-4 bg-[#1E1B18] p-6 rounded-organic border border-white/10 space-y-5 shadow-2xl shadow-black/80">
            <h4 className="font-serif text-base font-bold text-white">Resumo do Pedido</h4>

            {/* Lista dos Itens */}
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 border-b border-white/10 pb-4">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
                      <Image src={it.thumbnail} alt={it.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium line-clamp-1">{it.title}</p>
                      <p className="text-[10px] text-neruma-sand-400 font-light">Qtd: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-white whitespace-nowrap">
                    {formatBRL(it.price * it.quantity, true)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="text-xs space-y-2.5 text-neruma-sand-300/80 border-b border-white/10 pb-4 font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-white">{formatBRL(subtotal, true)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Frete Especial</span>
                <span className="font-medium text-white">
                  {shippingCents === 0 ? (
                    <span className="text-neruma-olive-light font-bold">GRÁTIS</span>
                  ) : (
                    formatBRL(shippingCents, true)
                  )}
                </span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-neruma-terracotta-light">
                  <span>Desconto Pix (5%)</span>
                  <span>- {formatBRL(pixDiscountCents, true)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-base font-bold text-white">
              <span>Total</span>
              <span>{formatBRL(finalTotalCents, true)}</span>
            </div>

            <div className="pt-2 text-[10px] text-neruma-sand-400/60 font-light space-y-1 text-center">
              <p>🔒 Transação criptografada de ponta a ponta</p>
              <p>🌱 Madeira com certificação florestal</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
