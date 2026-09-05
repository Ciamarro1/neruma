import React from 'react';
import Link from 'next/link';
import { Container } from '../../../components/ui/Container';
import { ProductCard } from '../../../components/product/ProductCard';
import { getProducts, getCategories } from '../../../lib/medusa/products';
import { constructMetadata } from '../../../lib/seo/metadata';

export const metadata = constructMetadata({
  title: 'Catálogo de Decoração & Peças Autorais',
  description:
    'Explore toda a coleção de quadros, painéis botânicos, luminárias e mobiliário pet artesanal.',
  path: '/produtos',
});

export const revalidate = 120; // 2 minutos

export default async function ProductsCatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 40 }),
    getCategories(),
  ]);

  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        {/* Cabeçalho do Catálogo */}
        <div className="border-b border-white/10 pb-10 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Design Orgânico & Biofílico
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Todas as Criações
          </h1>
          <p className="text-sm text-neruma-sand-400/80 mt-2.5 max-w-xl font-light leading-relaxed">
            Peças exclusivas confeccionadas à mão em madeiras nobres e fibras naturais brasileiras, com suporte a visualização 3D interativa.
          </p>

          {/* Filtros de Categorias */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-8">
              <span className="px-4 py-1.5 rounded-full bg-neruma-terracotta text-white text-xs font-medium">
                Todos
              </span>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/categorias/${cat.handle}`}
                  className="px-4 py-1.5 rounded-full bg-[#1A1816] border border-white/10 text-neruma-sand-300 hover:text-white hover:border-neruma-terracotta-light/40 text-xs font-medium transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-3 text-center py-24 text-neruma-sand-400/60 font-light">
              <p>Nenhuma peça encontrada no catálogo no momento.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
