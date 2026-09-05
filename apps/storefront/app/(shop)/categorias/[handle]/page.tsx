import React from 'react';
import Link from 'next/link';
import { Container } from '../../../../components/ui/Container';
import { ProductCard } from '../../../../components/product/ProductCard';
import { getProducts } from '../../../../lib/medusa/products';
import { constructMetadata } from '../../../../lib/seo/metadata';

interface CategoryPageProps {
  params: Promise<{ handle: string }>;
}

const CATEGORY_META: Record<
  string,
  { title: string; subtitle: string; description: string; queryKey: string }
> = {
  'quadros-e-paineis': {
    title: 'Quadros & Painéis Botânicos',
    subtitle: 'Esculturas de parede com fibras naturais, tramas manuais e molduras em freijó nobre',
    description:
      'Composições biofílicas que trazem a organicidade do design natural para interiores contemporâneos.',
    queryKey: 'quadro',
  },
  'luminarias-organicas': {
    title: 'Luminárias Orgânicas',
    subtitle: 'Iluminação difusa tecida em nós de macramê e fibras naturais brasileiras',
    description:
      'Luminárias pendentes e cúpulas artesanais com atmosfera de luz acolhedora e suporte a visualização 3D.',
    queryKey: 'luminaria',
  },
  'mobiliario-pet': {
    title: 'Mobiliário & Conforto Pet',
    subtitle: 'Camas e tocas suspensas em nós de macramê e estrutura em madeira certificada',
    description:
      'Design funcional e elegante para harmonizar o bem-estar animal com a estética natural do seu lar.',
    queryKey: 'pet',
  },
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { handle } = await params;
  const meta = CATEGORY_META[handle] || {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    subtitle: 'Peças exclusivas de decoração biofílica',
    description: 'Catálogo especializado em peças autorais e sustentáveis.',
  };

  return constructMetadata({
    title: `${meta.title} — Neruma Design Orgânico`,
    description: meta.description,
    path: `/categorias/${handle}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { handle } = await params;
  const meta = CATEGORY_META[handle] || {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    subtitle: 'Design Biofílico & Decoração Autoral',
    description: 'Peças em madeiras nobres e fibras naturais tecidas à mão.',
    queryKey: handle,
  };

  const allProducts = await getProducts({ limit: 40 });

  // Filtrar produtos que combinam com a categoria pelo handle, título ou materiais
  let filteredProducts = allProducts.filter((p: any) => {
    const handleLower = (p.handle || '').toLowerCase();
    const titleLower = (p.title || '').toLowerCase();
    const q = meta.queryKey.toLowerCase();

    if (q === 'luminaria') {
      return handleLower.includes('luminaria') || titleLower.includes('luminária');
    }
    if (q === 'quadro') {
      return (
        handleLower.includes('painel') ||
        handleLower.includes('quadro') ||
        titleLower.includes('painel') ||
        titleLower.includes('quadro')
      );
    }
    if (q === 'pet') {
      return handleLower.includes('pet') || titleLower.includes('pet');
    }
    return handleLower.includes(q) || titleLower.includes(q);
  });

  // Se não houver produtos específicos filtrados para essa categoria, exibir catálogo geral
  if (filteredProducts.length === 0) {
    filteredProducts = allProducts;
  }

  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        {/* Breadcrumb */}
        <nav className="text-xs text-neruma-sand-400/60 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-neruma-sand-200 transition-colors">
            Início
          </Link>
          <span className="mx-2.5 opacity-30">/</span>
          <Link href="/produtos" className="hover:text-neruma-sand-200 transition-colors">
            Catálogo
          </Link>
          <span className="mx-2.5 opacity-30">/</span>
          <span className="text-neruma-sand-200 font-medium">{meta.title}</span>
        </nav>

        {/* Cabeçalho */}
        <div className="border-b border-white/10 pb-10 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Categoria Autoral
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            {meta.title}
          </h1>
          <p className="text-sm text-neruma-sand-400 max-w-2xl font-light leading-relaxed">
            {meta.subtitle}
          </p>
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
