import { medusa } from './client';
import { FALLBACK_PRODUCTS } from './mock-data';

export interface GetProductsParams {
  category_id?: string[];
  collection_id?: string[];
  handle?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

export async function getProducts(params: GetProductsParams = {}): Promise<any> {
  try {
    const response = await medusa.store.product.list({
      limit: params.limit || 20,
      offset: params.offset || 0,
      fields: '+metadata,*variants',
      ...params,
    });
    if (response.products && response.products.length > 0) {
      return response.products;
    }
  } catch {
    console.warn('[Medusa] Backend indisponível, utilizando catálogo mock.');
  }
  return FALLBACK_PRODUCTS.slice(0, params.limit || 20);
}

export async function getProductByHandle(handle: string): Promise<any> {
  try {
    const response = await medusa.store.product.list({
      handle,
      fields: '+metadata,*variants,+categories',
      limit: 1,
    });
    if (response.products?.[0]) {
      return response.products[0];
    }
  } catch (error) {
    console.warn(`[Medusa] Backend indisponível para "${handle}", utilizando mock.`);
  }
  return FALLBACK_PRODUCTS.find((p) => p.handle === handle) || null;
}

export async function getCategories(): Promise<any> {
  try {
    const response = await medusa.store.category.list();
    return response.product_categories || [];
  } catch (error) {
    console.error('[Medusa] Erro ao buscar categorias:', error);
    return [];
  }
}
