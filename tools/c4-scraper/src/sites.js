/**
 * Site profiles.
 *
 * The collector was written for carrefour.fr; the same flow (home page, cookie
 * banner, search, product sheet, gallery) works on the other French retail
 * sites used by the Zava demo, so everything that is site specific — URLs,
 * cookie banners, product link shape, image hosts and the Zava category
 * table — is declared here instead of being hard-coded in the flow.
 *
 * Patterns are plain strings, not RegExp objects, because the extraction
 * config is serialised into the browser page by `page.evaluate`.
 */

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

/** Clothing categories declared in ClothingSeeder.GenerateCategories(). */
const CLOTHING_CATEGORIES = [
  { id: 1, name: 'chemises homme', keywords: ['chemise'] },
  { id: 2, name: 't-shirts & polos homme', keywords: ['t-shirt', 'tee-shirt', 'polo', 'mariniere', 'marinière', 'debardeur homme'] },
  { id: 3, name: 'pulls & sweats homme', keywords: ['pull homme', 'sweat', 'hoodie', 'cardigan homme', 'gilet homme', 'maille homme'] },
  { id: 4, name: 'pantalons & jeans homme', keywords: ['pantalon homme', 'jean homme', 'chino', 'jogger', 'short homme', 'bermuda'] },
  { id: 5, name: 'vestes & manteaux homme', keywords: ['veste', 'blouson', 'manteau', 'parka', 'doudoune', 'trench'] },
  { id: 6, name: 'hauts & chemisiers femme', keywords: ['chemisier', 'blouse', 'top femme', 'debardeur femme', 'débardeur femme', 'body'] },
  { id: 7, name: 'robes & jupes femme', keywords: ['robe', 'jupe', 'combinaison'] },
  { id: 8, name: 'mailles & sweats femme', keywords: ['pull femme', 'maille femme', 'cardigan femme', 'gilet femme', 'sweat femme'] },
  { id: 9, name: 'pantalons & jeans femme', keywords: ['pantalon femme', 'jean femme', 'legging', 'short femme'] },
  { id: 10, name: 'accessoires & sous-vêtements', keywords: ['ceinture', 'bonnet', 'echarpe', 'écharpe', 'chaussette', 'casquette', 'boxer', 'lingerie', 'soutien-gorge', 'accessoire', 'sac'] },
];

/** Sports categories declared in SportsSeeder.GenerateCategories(). */
const SPORTS_CATEGORIES = [
  { id: 1, name: 'running', keywords: ['running', 'course a pied', 'course à pied', 'trail', 'jogging'] },
  { id: 2, name: 'fitness & musculation', keywords: ['fitness', 'musculation', 'cardio', 'halter', 'kettlebell', 'tapis de course', 'rameur', 'elliptique'] },
  { id: 3, name: 'football', keywords: ['football', 'foot', 'crampon', 'gardien'] },
  { id: 4, name: 'randonnée & camping', keywords: ['randonnee', 'randonnée', 'camping', 'bivouac', 'tente', 'trekking', 'sac a dos', 'sac à dos'] },
  { id: 5, name: 'vélo', keywords: ['velo', 'vélo', 'vtt', 'cycl', 'bike'] },
  { id: 6, name: 'natation', keywords: ['natation', 'piscine', 'maillot de bain', 'lunettes de natation', 'palme'] },
  { id: 7, name: 'tennis & raquettes', keywords: ['tennis', 'badminton', 'padel', 'squash', 'ping-pong', 'tennis de table', 'raquette'] },
  { id: 8, name: 'sports d’hiver', keywords: ['ski', 'snowboard', 'hiver', 'luge', 'montagne enneig'] },
  { id: 9, name: 'basket & sports co', keywords: ['basket', 'handball', 'volley', 'rugby', 'sport collectif'] },
  { id: 10, name: 'yoga & bien-être', keywords: ['yoga', 'pilates', 'meditation', 'méditation', 'bien-etre', 'bien-être', 'recuperation', 'récupération', 'massage'] },
];

const COMMON_SEARCH_SELECTORS = [
  'input[name="q"]',
  'input[type="search"]',
  'input[placeholder*="recherch" i]',
  '[data-testid*="search"] input',
];

const COMMON_COOKIE_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '#didomi-notice-agree-button',
  'button:has-text("Tout accepter")',
  'button:has-text("Accepter tout")',
  'button:has-text("J\'accepte")',
  '[data-testid="accept-all-cookies"]',
];

const GALLERY_SELECTORS = '[class*="gallery"] img, [class*="carousel"] img, [class*="product-media"] img, picture img';

/**
 * @typedef {object} SiteProfile
 * @property {string} key             CLI name (`--site <key>`)
 * @property {string} label           Human readable shop name
 * @property {string} siteType        Matching Zava SiteType
 * @property {string} home            Home page URL
 * @property {string} searchPath      Search page path, `{q}` is replaced by the encoded query
 * @property {string} productPathPattern  Regex source matched against the product URL path
 * @property {string} imageHostPattern    Regex source matched against image hostnames
 * @property {string} imageSelector       Extra CSS selectors for gallery pictures
 * @property {string} titleSuffixPattern  Regex source of the shop suffix to strip from <title>
 * @property {string[]} cookieSelectors
 * @property {string[]} searchSelectors
 * @property {string} skuPrefix
 * @property {number} fallbackCategoryId
 * @property {{id: number, name: string, keywords: string[]}[]} categories
 */

/** @type {Record<string, SiteProfile>} */
export const SITES = {
  carrefour: {
    key: 'carrefour',
    label: 'Carrefour',
    siteType: 'Grocery',
    home: 'https://www.carrefour.fr/',
    searchPath: 's?q={q}',
    productPathPattern: '/p/',
    imageHostPattern: '(^|\\.)carrefour\\.(fr|com|eu)$',
    imageSelector: `img[src*="carrefour"], ${GALLERY_SELECTORS}`,
    titleSuffixPattern: '\\s*\\|\\s*Carrefour.*$',
    cookieSelectors: COMMON_COOKIE_SELECTORS,
    searchSelectors: COMMON_SEARCH_SELECTORS,
    skuPrefix: 'CRF',
    fallbackCategoryId: 6,
    categories: GROCERY_CATEGORIES,
  },
  celio: {
    key: 'celio',
    label: 'Celio',
    siteType: 'Clothing',
    home: 'https://www.celio.com/fr-fr/',
    searchPath: 'search?q={q}',
    // Celio product sheets end with the product reference: /fr-fr/<slug>/<ref>.html
    productPathPattern: '\\.html$|/p/',
    imageHostPattern: '(^|\\.)(celio\\.(com|fr)|demandware\\.(static|edgesuite)\\.net)$',
    imageSelector: `img[src*="celio"], img[src*="dw/image"], ${GALLERY_SELECTORS}`,
    titleSuffixPattern: '\\s*[|\\-]\\s*[Cc]elio.*$',
    cookieSelectors: COMMON_COOKIE_SELECTORS,
    searchSelectors: COMMON_SEARCH_SELECTORS,
    skuPrefix: 'CEL',
    fallbackCategoryId: 10,
    categories: CLOTHING_CATEGORIES,
  },
  decathlon: {
    key: 'decathlon',
    label: 'Decathlon',
    siteType: 'Sports',
    home: 'https://www.decathlon.fr/',
    searchPath: 'search?Ntt={q}',
    // Decathlon product sheets look like /p/<slug>/_/R-p-123456
    productPathPattern: '/p/',
    imageHostPattern: '(^|\\.)(decathlon\\.(fr|com)|mediadecathlon\\.com)$',
    imageSelector: `img[src*="decathlon"], ${GALLERY_SELECTORS}`,
    titleSuffixPattern: '\\s*[|\\-]\\s*[Dd]ecathlon.*$',
    cookieSelectors: COMMON_COOKIE_SELECTORS,
    searchSelectors: COMMON_SEARCH_SELECTORS,
    skuPrefix: 'DKT',
    fallbackCategoryId: 2,
    categories: SPORTS_CATEGORIES,
  },
};

export const DEFAULT_SITE = SITES.carrefour;

/** @returns {SiteProfile} the profile for `key`, or throws with the known names. */
export function getSite(key) {
  const site = SITES[String(key ?? '').toLowerCase()];
  if (!site) throw new Error(`Unknown site "${key}". Known sites: ${Object.keys(SITES).join(', ')}`);
  return site;
}

/** Builds the search results URL for a query. */
export function searchUrl(site, query) {
  return new URL(site.searchPath.replace('{q}', encodeURIComponent(query)), site.home).href;
}

/** The serialisable subset of the profile handed over to the in-page extractors. */
export function extractionConfig(site) {
  return {
    productPathPattern: site.productPathPattern,
    imageHostPattern: site.imageHostPattern,
    imageSelector: site.imageSelector,
    titleSuffixPattern: site.titleSuffixPattern,
  };
}
