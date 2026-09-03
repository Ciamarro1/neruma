import React from 'react';
import { Container } from '../../../components/ui/Container.js';
import { ProductCard } from '../../../components/product/ProductCard.js';
import { searchProducts } from '../../../lib/search/typesense.js';
import { getProducts } from '../../../lib/medusa/products.js';
import { constructMetadata } from '../../../lib/seo/metadata.js';
import { Search } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Busca — Encontre por Material, Estilo e Ambiente',
  description: 'Pesquise nosso acervo por palavras-chave, madeira nobre, fibras naturais e ambientes.',
  path: '/busca',
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string; material?: string; room?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', material, room } = await searchParams;

  let products: any[] = [];
  const searchResults = await searchProducts({
    query: q || '*',
    materials: material ? [material] : [],
    rooms: room ? [room] : [],
    perPage: 20,
  });

  if (searchResults?.hits && searchResults.hits.length > 0) {
    products = searchResults.hits.map((hit: any) => hit.document);
  } else {
    // Fallback para listagem Medusa
    products = await getProducts({ limit: 12 });
  }

  return (
    <div className="py-12 pb-24">
      <Container size="lg">
        {/* Barra de Busca */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neruma-dark mb-4">
            O que você deseja para o seu espaço?
          </h1>
          <form action="/busca" method="GET" className="relative">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="ex: quadro de freijó para sala, luminária de sisal..."
              className="w-full px-6 py-4 pr-12 text-sm bg-white border border-neruma-border rounded-full focus:outline-none focus:border-neruma-dark shadow-card"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-neruma-dark hover:text-neruma-wood"
              aria-label="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Resultados */}
        <div className="border-t border-neruma-border pt-8">
          <div className="flex justify-between items-center mb-8">
            <p className="text-xs uppercase tracking-wider text-neruma-muted">
              {q ? `Resultados para "${q}"` : 'Todas as Obras'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
