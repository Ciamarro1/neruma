import { medusa } from './client';

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
      fields: '+metadata,+variants.calculated_price',
      ...params,
    });
    return response.products || [];
  } catch (error) {
    console.error('[Medusa] Erro ao buscar produtos:', error);
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<any> {
  try {
    const response = await medusa.store.product.list({
      handle,
      fields: '+metadata,+variants.calculated_price,+categories',
      limit: 1,
    });
    return response.products?.[0] || null;
  } catch (error) {
    console.error(`[Medusa] Erro ao buscar produto pelo handle "${handle}":`, error);
    return null;
  }
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
