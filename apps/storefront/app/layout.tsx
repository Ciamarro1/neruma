import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
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
      <body className="min-h-screen flex flex-col bg-neruma-bg text-neruma-dark selection:bg-neruma-sand-300">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
