import { useCallback, useMemo, useState } from 'react';
import type { RecipeHideScope } from '../types';

const STORAGE_KEYS: Record<RecipeHideScope, string> = {
  session: 'zava-recipe-hidden-session',
  forever: 'zava-recipe-hidden-forever',
};
// The API refuses longer exclusion lists, so never let the browser build one it cannot send.
const MAX_HIDDEN = 100;

export interface HiddenRecipeProduct {
  productId: number;
  productName: string;
  scope: RecipeHideScope;
}

type StoredProduct = Pick<HiddenRecipeProduct, 'productId' | 'productName'>;

const storage = (scope: RecipeHideScope): Storage | null => {
  try {
    return scope === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    // Private browsing and blocked storage must not break the recipe basket.
    return null;
  }
};

function read(scope: RecipeHideScope): StoredProduct[] {
  let raw: string | null = null;
  try {
    raw = storage(scope)?.getItem(STORAGE_KEYS[scope]) ?? null;
  } catch { return []; }
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<number>();
    const products: StoredProduct[] = [];
    for (const entry of parsed) {
      if (typeof entry !== 'object' || entry === null) continue;
      const { productId, productName } = entry as Partial<StoredProduct>;
      if (typeof productId !== 'number' || !Number.isSafeInteger(productId) || productId <= 0) continue;
      if (seen.has(productId)) continue;
      seen.add(productId);
      products.push({ productId, productName: typeof productName === 'string' ? productName : '' });
    }
    return products.slice(0, MAX_HIDDEN);
  } catch {
    return [];
  }
}

function write(scope: RecipeHideScope, products: StoredProduct[]) {
  try {
    const store = storage(scope);
    // An empty list means nothing is hidden, so drop the key instead of leaving "[]" behind.
    if (products.length) store?.setItem(STORAGE_KEYS[scope], JSON.stringify(products));
    else store?.removeItem(STORAGE_KEYS[scope]);
  } catch { /* Full or unavailable storage only loses the preference, never the basket. */ }
}

/**
 * Remembers products the customer asked never to be suggested again, either for the
 * current tab (`session`) or on this device until they undo it (`forever`).
 */
export function useHiddenRecipeProducts() {
  const [sessionHidden, setSessionHidden] = useState<StoredProduct[]>(() => read('session'));
  const [foreverHidden, setForeverHidden] = useState<StoredProduct[]>(() => read('forever'));

  const update = useCallback((scope: RecipeHideScope, next: (previous: StoredProduct[]) => StoredProduct[]) => {
    const setter = scope === 'session' ? setSessionHidden : setForeverHidden;
    setter((previous) => {
      const updated = next(previous).slice(0, MAX_HIDDEN);
      write(scope, updated);
      return updated;
    });
  }, []);

  const hide = useCallback((product: StoredProduct, scope: RecipeHideScope) => {
    const other: RecipeHideScope = scope === 'session' ? 'forever' : 'session';
    // A product belongs to exactly one scope, so changing scope moves it instead of duplicating it.
    update(other, (previous) => previous.filter((entry) => entry.productId !== product.productId));
    update(scope, (previous) => [
      ...previous.filter((entry) => entry.productId !== product.productId),
      { productId: product.productId, productName: product.productName },
    ]);
  }, [update]);

  const unhide = useCallback((productId: number) => {
    update('session', (previous) => previous.filter((entry) => entry.productId !== productId));
    update('forever', (previous) => previous.filter((entry) => entry.productId !== productId));
  }, [update]);

  const hidden = useMemo<HiddenRecipeProduct[]>(() => [
    ...sessionHidden.map((entry) => ({ ...entry, scope: 'session' as const })),
    ...foreverHidden.map((entry) => ({ ...entry, scope: 'forever' as const })),
  ], [sessionHidden, foreverHidden]);

  const scopeOf = useCallback((productId: number): RecipeHideScope | null =>
    sessionHidden.some((entry) => entry.productId === productId) ? 'session'
      : foreverHidden.some((entry) => entry.productId === productId) ? 'forever' : null,
  [sessionHidden, foreverHidden]);

  const hiddenIds = useMemo(
    () => [...new Set(hidden.map((entry) => entry.productId))].slice(0, MAX_HIDDEN),
    [hidden],
  );

  return { hidden, hiddenIds, hide, unhide, scopeOf };
}
