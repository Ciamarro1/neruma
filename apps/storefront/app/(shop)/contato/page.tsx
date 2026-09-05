'use client';

import React, { useState } from 'react';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="md">
        {/* Cabeçalho */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light">
            Canais de Atendimento
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Fale com o Nosso Ateliê
          </h1>
          <p className="text-sm text-neruma-sand-400 font-light leading-relaxed">
            Dúvidas sobre projetos especiais sob medida, consultoria biofílica ou parcerias arquitetônicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Informações Diretas */}
          <div className="md:col-span-5 bg-[#1A1816] p-8 rounded-organic border border-white/10 space-y-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white">Canais Diretos</h3>

            <div className="space-y-4 text-xs text-neruma-sand-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neruma-terracotta-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">E-mail</p>
                  <p className="font-light text-neruma-sand-400">contato@neruma.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neruma-terracotta-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">WhatsApp Concierge</p>
                  <p className="font-light text-neruma-sand-400">+55 (11) 98765-4321</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neruma-terracotta-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Ateliês de Manufatura</p>
                  <p className="font-light text-neruma-sand-400">São Paulo / SP & Tiradentes / MG</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-neruma-sand-400 font-light">
              <p>Horário de Atendimento:</p>
              <p className="text-white font-medium">Segunda a Sexta, das 09h às 18h</p>
            </div>
          </div>

          {/* Formulário Interativo */}
          <div className="md:col-span-7 bg-[#1A1816] p-8 rounded-organic border border-white/10 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neruma-olive/20 border border-neruma-olive/40 flex items-center justify-center mx-auto text-neruma-olive-light">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white">Mensagem Enviada</h4>
                <p className="text-xs text-neruma-sand-300 font-light max-w-xs mx-auto leading-relaxed">
                  Agradecemos seu contato. Nossa equipe de curadores responderá em até 24 horas úteis.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-neruma-terracotta-light hover:underline pt-2 font-medium"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">Envie uma Mensagem</h3>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neruma-sand-300 mb-1 font-semibold">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neruma-sand-300 mb-1 font-semibold">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neruma-sand-300 mb-1 font-semibold">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Como podemos ajudar no seu espaço?"
                    className="w-full px-4 py-2.5 text-sm bg-[#141210] border border-white/15 text-white rounded-neruma focus:outline-none focus:border-neruma-terracotta-light transition-all"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-neruma-terracotta hover:bg-neruma-terracotta-dark text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Enviar Mensagem</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
