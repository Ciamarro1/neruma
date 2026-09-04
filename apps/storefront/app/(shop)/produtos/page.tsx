import React from 'react';
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
    <div className="py-12 pb-24">
      <Container size="lg">
        <div className="border-b border-neruma-border pb-8 mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-neruma-wood block mb-2">
            Design Orgânico
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neruma-dark">
            Todas as Criações
          </h1>
          <p className="text-sm text-neruma-muted mt-2 max-w-xl">
            Peças exclusivas confeccionadas à mão em madeiras nobres e fibras naturais brasileiras.
          </p>
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-24 text-neruma-muted">
              <p>Nenhuma peça encontrada no catálogo no momento.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
