import { medusa } from './client';

export async function createCart(regionId?: string): Promise<any> {
  try {
    const response = await medusa.store.cart.create({
      region_id: regionId,
    });
    return response.cart;
  } catch (error) {
    console.error('[Medusa] Erro ao criar carrinho:', error);
    throw error;
  }
}

export async function getCart(cartId: string): Promise<any> {
  try {
    const response = await medusa.store.cart.retrieve(cartId, {
      fields: '+items.variant.product,+shipping_methods,+payment_collection',
    });
    return response.cart;
  } catch (error) {
    console.error(`[Medusa] Erro ao buscar carrinho "${cartId}":`, error);
    return null;
  }
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<any> {
  try {
    const response = await medusa.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return response.cart;
  } catch (error) {
    console.error(`[Medusa] Erro ao adicionar item ao carrinho "${cartId}":`, error);
    throw error;
  }
}

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number): Promise<any> {
  try {
    const response = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    });
    return response.cart;
  } catch (error) {
    console.error(`[Medusa] Erro ao atualizar item no carrinho:`, error);
    throw error;
  }
}

export async function deleteLineItem(cartId: string, lineItemId: string): Promise<any> {
  try {
    const response = await medusa.store.cart.deleteLineItem(cartId, lineItemId);
    return response.parent;
  } catch (error) {
    console.error(`[Medusa] Erro ao remover item do carrinho:`, error);
    throw error;
  }
}

export async function addShippingMethod(cartId: string, optionId: string): Promise<any> {
  try {
    const response = await medusa.store.cart.addShippingMethod(cartId, {
      option_id: optionId,
    });
    return response.cart;
  } catch (error) {
    console.error('[Medusa] Erro ao definir método de frete:', error);
    throw error;
  }
}
