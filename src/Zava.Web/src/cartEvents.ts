import type { Cart } from './types';

export const CART_UPDATED_EVENT = 'zava:cart-updated';

/** Publishes the authoritative cart returned by the server so the header badge updates immediately. */
export function publishCart(cart: Cart) {
  window.dispatchEvent(new CustomEvent<Cart>(CART_UPDATED_EVENT, { detail: cart }));
}
