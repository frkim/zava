import { useCallback, useRef, useState } from 'react';
import { addToCart } from '../api';
import { publishCart } from '../cartEvents';
import { useFeedback } from '../context/FeedbackContext';
import { useLanguage } from '../context/LanguageContext';
import type { Cart, Product } from '../types';

/**
 * Standard "add to cart" action: one request per intentional click, pending state per product,
 * immediate badge update from the server response, and a success or persistent error message.
 */
export function useAddToCart() {
  const { lang, t } = useLanguage();
  const { notify } = useFeedback();
  const pendingRef = useRef(new Set<number>());
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(new Set());

  const add = useCallback(async (product: Product, quantity = 1, variantId?: number): Promise<Cart | null> => {
    if (pendingRef.current.has(product.id)) return null;
    pendingRef.current.add(product.id);
    setPendingIds(new Set(pendingRef.current));

    const name = lang === 'en' && product.nameEn ? product.nameEn : product.name;
    try {
      const cart = await addToCart(product.id, quantity, variantId);
      publishCart(cart);
      notify({ severity: 'success', message: `${name} ${t('feedback.addedToCart')}`, actionLabel: t('common.viewCart'), actionTo: '/cart' });
      return cart;
    } catch (error) {
      const reason = error instanceof Error ? error.message : '';
      notify({ severity: 'error', message: reason ? `${t('feedback.addToCartFailed')} : ${reason}` : t('feedback.addToCartFailed') });
      return null;
    } finally {
      pendingRef.current.delete(product.id);
      setPendingIds(new Set(pendingRef.current));
    }
  }, [lang, notify, t]);

  const isPending = useCallback((productId: number) => pendingIds.has(productId), [pendingIds]);

  return { add, isPending };
}
