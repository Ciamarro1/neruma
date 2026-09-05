import Typesense from 'typesense';

const typesenseHost = process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost';
const typesensePort = Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT || 8108);
const typesenseProtocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http';
const typesenseApiKey =
  process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY ||
  process.env.TYPESENSE_PUBLIC_SEARCH_KEY ||
  'neruma_typesense_secret_key_123';

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: typesenseHost,
      port: typesensePort,
      protocol: typesenseProtocol,
    },
  ],
  apiKey: typesenseApiKey,
  connectionTimeoutSeconds: 1,
  numRetries: 0,
  logLevel: 'silent',
});

export interface SearchFilters {
  query?: string;
  category?: string;
  materials?: string[];
  styles?: string[];
  rooms?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

export async function searchProducts(filters: SearchFilters = {}) {
  const {
    query = '*',
    category,
    materials = [],
    styles = [],
    rooms = [],
    minPrice,
    maxPrice,
    page = 1,
    perPage = 12,
  } = filters;

  const filterByParts: string[] = [];

  if (category) filterByParts.push(`category:=${category}`);
  if (materials.length > 0) filterByParts.push(`materials:[${materials.join(',')}]`);
  if (styles.length > 0) filterByParts.push(`styles:[${styles.join(',')}]`);
  if (rooms.length > 0) filterByParts.push(`rooms:[${rooms.join(',')}]`);
  if (minPrice !== undefined) filterByParts.push(`price:>=${minPrice}`);
  if (maxPrice !== undefined) filterByParts.push(`price:<=${maxPrice}`);

  try {
    const searchResults = await typesenseClient
      .collections('products')
      .documents()
      .search({
        q: query,
        query_by: 'name,description,materials,styles,rooms',
        filter_by: filterByParts.length > 0 ? filterByParts.join(' && ') : undefined,
        facet_by: 'category,materials,styles,rooms',
        page,
        per_page: perPage,
        sort_by: query === '*' ? 'created_at:desc' : '_text_match:desc',
      });

    return searchResults;
  } catch {
    // Typesense offline no ambiente local: fallback silencioso para catálogo do Medusa/Mock
    return null;
  }
}
