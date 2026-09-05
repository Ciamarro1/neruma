import React from 'react';
import Link from 'next/link';
import { Container } from '../../../components/ui/Container';
import { ProductCard } from '../../../components/product/ProductCard';
import { searchProducts } from '../../../lib/search/typesense';
import { getProducts } from '../../../lib/medusa/products';
import { constructMetadata } from '../../../lib/seo/metadata';
import { Search, Sparkles } from 'lucide-react';

export const metadata = constructMetadata({
  title: 'Busca — Encontre por Material, Estilo e Ambiente',
  description: 'Pesquise nosso acervo por palavras-chave, madeira nobre, fibras naturais e ambientes.',
  path: '/busca',
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string; material?: string; room?: string }>;
}

const QUICK_SUGGESTIONS = [
  { label: 'Luminária', query: 'luminaria' },
  { label: 'Macramê', query: 'macrame' },
  { label: 'Ninho', query: 'ninho' },
  { label: 'Painel', query: 'painel' },
  { label: 'Sisal', query: 'sisal' },
  { label: 'Algodão', query: 'algodao' },
];

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
    products = searchResults.hits.map((hit: any) => ({
      ...hit.document,
      title: hit.document.title || hit.document.name,
    }));
  } else {
    // Fallback inteligente no catálogo com filtragem local por query, material e room
    const allProducts = await getProducts({ limit: 50 });
    
    if (q && q.trim() !== '') {
      const qNorm = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      products = allProducts.filter((p: any) => {
        const title = (p.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const subtitle = (p.subtitle || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const desc = (p.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const handle = (p.handle || '').toLowerCase();
        const materials = (p.metadata?.design?.materials || []).join(' ').toLowerCase().replace(/_/g, ' ');
        const styles = (p.metadata?.design?.styles || []).join(' ').toLowerCase().replace(/_/g, ' ');
        const rooms = (p.metadata?.design?.rooms || []).join(' ').toLowerCase().replace(/_/g, ' ');

        return (
          title.includes(qNorm) ||
          subtitle.includes(qNorm) ||
          desc.includes(qNorm) ||
          handle.includes(qNorm) ||
          materials.includes(qNorm) ||
          styles.includes(qNorm) ||
          rooms.includes(qNorm)
        );
      });
    } else {
      products = allProducts;
    }

    if (material) {
      products = products.filter((p: any) =>
        p.metadata?.design?.materials?.includes(material)
      );
    }

    if (room) {
      products = products.filter((p: any) =>
        p.metadata?.design?.rooms?.includes(room)
      );
    }
  }

  return (
    <div className="py-12 pb-28 bg-[#141210] text-neruma-sand-100 min-h-screen">
      <Container size="lg">
        {/* Barra de Busca Dark */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-neruma-terracotta-light block mb-2">
            Exploração Guiada
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
            O que você deseja para o seu espaço?
          </h1>
          <form action="/busca" method="GET" className="relative mb-4">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="ex: luminária de macramê, quadro freijó, sisal..."
              className="w-full px-6 py-4 pr-12 text-sm bg-[#1A1816] text-white placeholder-neruma-sand-400/50 border border-white/15 rounded-full focus:outline-none focus:border-neruma-terracotta-light shadow-2xl shadow-black/80 transition-all"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-neruma-terracotta-light hover:text-white transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Sugestões Rápidas */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-neruma-sand-400/50 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-neruma-terracotta-light" /> Sugestões:
            </span>
            {QUICK_SUGGESTIONS.map((sug) => (
              <Link
                key={sug.query}
                href={`/busca?q=${encodeURIComponent(sug.query)}`}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  q.toLowerCase() === sug.query
                    ? 'bg-neruma-terracotta text-white border-neruma-terracotta'
                    : 'bg-[#181614] text-neruma-sand-300 border-white/10 hover:border-neruma-terracotta-light/40 hover:text-white'
                }`}
              >
                {sug.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="border-t border-white/10 pt-10">
          <div className="flex justify-between items-center mb-8">
            <p className="text-xs uppercase tracking-widest text-neruma-sand-400/70 font-medium">
              {q ? `Resultados para "${q}"` : 'Todas as Obras do Acervo'}
            </p>
            <span className="text-xs text-neruma-sand-400/50 font-light">
              {products.length} {products.length === 1 ? 'peça encontrada' : 'peças encontradas'}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#1A1816] rounded-organic border border-white/10 p-8 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4 text-neruma-terracotta-light">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Nenhuma peça encontrada</h3>
              <p className="text-xs text-neruma-sand-300 leading-relaxed mb-6 font-light">
                Não encontramos peças correspondentes a &ldquo;{q}&rdquo;. Tente buscar por outros materiais como madeira, linho ou algodão.
              </p>
              <Link
                href="/produtos"
                className="inline-block px-6 py-2.5 rounded-full bg-neruma-terracotta hover:bg-neruma-terracotta-light text-white text-xs tracking-wider uppercase font-medium transition-colors shadow-lg"
              >
                Ver Catálogo Completo
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
