/**
 * Maps a scraped Carrefour product onto the Zava seeder product shape
 * (src/Zava.Api/Services/Seeders/Data/*-products.json).
 *
 * The English fields are pre-filled with the French text so the JSON is usable
 * immediately; translate them before committing a product to the repo.
 */

import { slugify } from './store.js';

/** Grocery categories declared in GrocerySeeder.GenerateCategories(). */
const GROCERY_CATEGORIES = [
  { id: 1, name: 'fruits & légumes', keywords: ['fruit', 'legume', 'légume', 'salade', 'pomme', 'banane'] },
  { id: 2, name: 'produits laitiers', keywords: ['lait', 'laitier', 'yaourt', 'fromage', 'beurre', 'creme', 'crème', 'oeuf', 'œuf'] },
  { id: 3, name: 'boulangerie & pâtisserie', keywords: ['pain', 'boulangerie', 'patisserie', 'pâtisserie', 'viennoiserie', 'brioche'] },
  { id: 4, name: 'viandes & charcuterie', keywords: ['viande', 'boeuf', 'bœuf', 'volaille', 'porc', 'charcuterie', 'jambon', 'poulet'] },
  { id: 5, name: 'poissonnerie', keywords: ['poisson', 'saumon', 'crustace', 'crustacé', 'sushi', 'marée', 'maree'] },
  { id: 6, name: 'épicerie salée', keywords: ['epicerie salee', 'épicerie salée', 'pate', 'pâte', 'riz', 'conserve', 'sauce', 'huile'] },
  { id: 7, name: 'épicerie sucrée', keywords: ['epicerie sucree', 'épicerie sucrée', 'biscuit', 'chocolat', 'cereale', 'céréale', 'confiture', 'gouter', 'goûter', 'tartiner'] },
  { id: 8, name: 'boissons', keywords: ['boisson', 'eau', 'jus', 'soda', 'cafe', 'café', 'the', 'thé', 'biere', 'bière', 'vin'] },
  { id: 9, name: 'surgelés', keywords: ['surgel', 'glace', 'congel'] },
  { id: 10, name: 'bio & bien-être', keywords: ['bio', 'sans gluten', 'complement', 'complément', 'bien-etre', 'bien-être'] },
];

/** Strips accents/case so "Epicerie sucrée" and "épicerie sucree" compare equal. */
function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Picks the most plausible Zava category.
 *
 * Signals are weighted so that the breadcrumb trail (what the shop itself says)
 * outranks words found in the product name — "Pâte à tartiner" sitting under
 * "Épicerie Sucrée" must not land in the savoury aisle. Shallow breadcrumbs
 * (the aisle) also outrank deep ones (the shelf), so a hot-chocolate powder
 * filed under "Epicerie sucrée > Boissons chaudes" stays in the sweet aisle.
 */
export function guessCategoryId(product, fallback = 6) {
  const breadcrumbs = (product.breadcrumbs ?? []).map(normalize).filter(Boolean);
  const name = normalize(product.name);

  let best = { id: fallback, score: 0 };
  for (const category of GROCERY_CATEGORIES) {
    const categoryName = normalize(category.name);
    const keywords = category.keywords.map(normalize);
    let score = 0;

    const exactIndex = breadcrumbs.findIndex((crumb) => crumb === categoryName);
    if (exactIndex >= 0) score += 10;

    const keywordIndex = breadcrumbs.findIndex((crumb) =>
      keywords.some((keyword) => crumb.includes(keyword)),
    );
    // Earlier crumbs describe the aisle and are the stronger signal.
    if (keywordIndex >= 0) score += keywordIndex <= 2 ? 4 : 2;

    if (keywords.some((keyword) => name.includes(keyword))) score += 1;
    if (score > best.score) best = { id: category.id, score };
  }
  return best.id;
}

/** Builds a deterministic SKU from the brand and the EAN (or the product name). */
function buildSku(product) {
  const brandPart = slugify(product.brand || 'carrefour')
    .replace(/-/g, '')
    .slice(0, 6)
    .toUpperCase();
  const idPart = product.ean
    ? String(product.ean).slice(-8)
    : slugify(product.name).replace(/-/g, '').slice(0, 10).toUpperCase();
  return `${brandPart || 'CRF'}-${idPart || 'PRODUCT'}`;
}

/**
 * Turns the feature list into a readable description block appended to the
 * marketing description, so nothing collected is lost.
 */
function composeDescription(product) {
  const base = (product.description ?? '').trim();
  const baseKey = base.toLowerCase();
  const bullets = (product.features ?? [])
    // Long legal / partner disclaimers add noise rather than product facts.
    .filter((feature) => feature.value && feature.value.length <= 220)
    .filter(
      (feature) => !/consotrust|allergobox|informations de ce produit sont certifi/i.test(feature.value),
    )
    // The legal name is frequently identical to the description itself.
    .filter((feature) => feature.value.trim().toLowerCase() !== baseKey)
    .slice(0, 8)
    .map((feature) => (feature.label ? `${feature.label} : ${feature.value}` : feature.value));
  if (!bullets.length) return base;
  return [base, bullets.join(' • ')].filter(Boolean).join(' ');
}

/**
 * @param {object} product raw scraped product
 * @param {{ id?: number, categoryId?: number, stock?: number }} options
 * @returns {object} product in the Zava seeder JSON shape
 */
export function toZavaProduct(product, { id = 0, categoryId, stock = 100 } = {}) {
  const description = composeDescription(product);
  const price = Number.isFinite(product.price) && product.price > 0 ? Number(product.price) : 0;
  const size = (product.features ?? []).find((feature) =>
    /contenance|poids|quantit|volume|format/i.test(feature.label ?? ''),
  )?.value;

  const tags = [product.brand, ...(product.breadcrumbs ?? []).slice(1)]
    .map((tag) => String(tag ?? '').trim())
    .filter(Boolean)
    .slice(0, 6);

  return {
    id,
    categoryId: categoryId ?? guessCategoryId(product),
    name: product.name ?? '',
    nameEn: product.name ?? '',
    description,
    descriptionEn: description,
    price: Number(price.toFixed(2)),
    brand: product.brand ?? '',
    sku: buildSku(product),
    stock,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    isPromo: false,
    variants: [
      {
        id,
        name: size ?? 'Standard',
        nameEn: size ?? 'Standard',
        value: size ?? 'Standard',
        priceAdjustment: 0,
        stock,
      },
    ],
    tags,
  };
}
