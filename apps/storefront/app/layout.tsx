import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartProvider } from '../context/CartContext';
import { CartDrawer } from '../components/cart/CartDrawer';
import { constructMetadata } from '../lib/seo/metadata';
import '../styles/globals.css';

export const metadata: Metadata = constructMetadata({
  title: 'Design Orgânico, Madeira Nobre & Fibras Naturais',
  description:
    'E-commerce editorial de decoração biofílica. Quadros em freijó, luminárias em fibras naturais tecidas à mão e mobiliário pet minimalista.',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#141210] text-neruma-sand-100 selection:bg-neruma-terracotta selection:text-white antialiased">
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
