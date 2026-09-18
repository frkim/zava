import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

let settings = { site: 'Grocery', available: true, optionsUnavailable: false, planFailures: 0, commitFailures: 0, commitStatus: 503, dropCommitResponses: 0, planDelay: 800, commitDelay: 500, expiryMs: 600000, empty: false };
let calls = [];
let cart = { items: [{ productId: 99, productName: 'Produit déjà au panier', variantId: 999, variantName: '500 g', quantity: 1, unitPrice: 2, subtotal: 2 }], total: 2, itemCount: 1 };
const plans = new Map();
const committed = new Set();
const products = new Map([
  [264, {
    id: 264,
    name: 'Weber Compact Kettle 47 cm',
    nameEn: 'Weber Compact Kettle 47 cm',
    description: 'Barbecue à charbon compact avec cuve et couvercle émaillés, grille de cuisson de 47 cm.',
    descriptionEn: 'Compact charcoal barbecue with porcelain-enamelled bowl and lid, plus a 47 cm cooking grate.',
    price: 159.99,
    promoPrice: 129.99,
    categoryId: 11,
    brand: 'Weber',
    sku: 'GROCERY-SMALL-WEB-COMPACT47',
    stock: 22,
    rating: 4.6,
    reviewCount: 118,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    isPromo: true,
    variants: [{ id: 1050, name: 'Diamètre', nameEn: 'Diameter', value: '47 cm', priceAdjustment: 0, stock: 22 }],
    tags: ['barbecue'],
    relatedProductIds: [],
    createdAt: '2026-01-01T00:00:00Z',
    siteType: 'Grocery',
    sustainability: null,
    isSecondLife: false,
    secondLife: null,
  }],
  [267, {
    id: 267,
    name: 'Instant Pot 921267 Classic Mini 3,8 L',
    nameEn: 'Instant Pot 921267 Classic Mini 3.8 L',
    description: 'Cocotte électrique multicuiseur 7-en-1 de 3,8 L et 800 W avec cuisson sous pression, mijotage, vapeur, sauté, yaourt et maintien au chaud.',
    descriptionEn: '3.8 L, 800 W 7-in-1 electric multi-cooker with pressure cooking, slow cooking, steaming, sautéing, yoghurt making and keep-warm functions.',
    price: 149.99,
    promoPrice: 89.99,
    categoryId: 11,
    brand: 'Instant Pot',
    sku: 'GROCERY-SMALL-INS-921267',
    stock: 32,
    rating: 4.7,
    reviewCount: 91,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    isPromo: true,
    variants: [{ id: 2670, name: 'Coloris', nameEn: 'Color', value: 'Noir', priceAdjustment: 0, stock: 32 }],
    tags: ['multicuiseur'],
    relatedProductIds: [],
    createdAt: '2026-01-01T00:00:00Z',
    siteType: 'Grocery',
    sustainability: null,
    isSecondLife: false,
    secondLife: null,
  }],
]);
const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS' });
  res.end(JSON.stringify(body));
};
http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, {});
  let raw = '';
  for await (const chunk of req) raw += chunk;
  const body = raw ? JSON.parse(raw) : {};
  if (req.url === '/__test' && req.method === 'POST') {
    settings = { ...settings, ...body };
    return send(res, 200, settings);
  }
  if (req.url === '/__test') return send(res, 200, { settings, calls, cart });
  if (req.url === '/api/config') return send(res, 200, { currentSiteType: settings.site, availableSiteTypes: [{ type: 'Grocery', name: 'Zava Marché', nameEn: 'Zava Grocery' }, { type: 'Electronics', name: 'Zava', nameEn: 'Zava' }] });
  if (req.url === '/api/config/site-type') {
    settings.site = body.siteType;
    return send(res, 200, { currentSiteType: settings.site, availableSiteTypes: [{ type: 'Grocery', name: 'Zava Marché', nameEn: 'Zava Grocery' }, { type: 'Electronics', name: 'Zava', nameEn: 'Zava' }] });
  }
  if (req.url === '/api/homepage') return send(res, 200, Object.fromEntries(['featuredProducts', 'bestSellers', 'newProducts', 'promoProducts', 'selectionProducts', 'secondLifeProducts', 'topCategories', 'brands'].map(key => [key, []])));
  if (req.url === '/api/cart') return send(res, 200, cart);
  const imageMatch = req.url.match(/^\/images\/products\/Grocery\/(264|267)\/1_medium\.jpg$/);
  if (imageMatch) {
    const imagePath = join(process.cwd(), 'src', 'Zava.Api', 'wwwroot', 'images', 'products', 'Grocery', imageMatch[1], '1_medium.jpg');
    const image = await readFile(imagePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Access-Control-Allow-Origin': '*' });
    return res.end(image);
  }
  if (req.url === '/api/cart/items' && req.method === 'POST') {
    const product = products.get(body.productId);
    if (!product) return send(res, 404, { message: 'Not found' });
    const unitPrice = product.promoPrice ?? product.price;
    cart.items.push({
      productId: product.id,
      productName: product.name,
      variantId: body.variantId ?? null,
      variantName: product.variants.find(variant => variant.id === body.variantId)?.value ?? null,
      unitPrice,
      quantity: body.quantity,
      subtotal: Math.round(unitPrice * body.quantity * 100) / 100,
    });
    cart.total = Math.round((cart.total + unitPrice * body.quantity) * 100) / 100;
    cart.itemCount += body.quantity;
    return send(res, 200, cart);
  }
  const productMatch = req.url.match(/^\/api\/products\/(\d+)$/);
  if (productMatch) {
    const product = products.get(Number(productMatch[1]));
    if (!product) return send(res, 404, { message: 'Not found' });
    return send(res, 200, { product, reviews: [], relatedProducts: [], category: null, images: [] });
  }
  if (req.url === '/api/recipe-basket/options') {
    calls.push({ path: req.url });
    if (settings.optionsUnavailable) return send(res, 503, { message: 'Service temporairement inaccessible' });
    return send(res, 200, { available: settings.available, suggestions: ['Lasagnes', 'Blanquette de veau', 'Carbonade', 'Bœuf bourguignon', 'BBQ', 'Repas végétarien', 'Pizza'] });
  }
  if (req.url === '/api/recipe-basket/plan') {
    calls.push({ path: req.url, body });
    await new Promise(resolve => setTimeout(resolve, settings.planDelay));
    if (settings.planFailures-- > 0) return send(res, 503, { message: 'Réessayez la préparation dans un instant.' });
    const excluded = new Set(body.excludedProductIds ?? []);
    const items = settings.empty ? [] : [
      { productId: 101, productName: 'Pâtes à lasagnes aux œufs', variantId: 1001, variantName: 'Paquet de 500 g', quantity: 1, unitPrice: 2.49, subtotal: 2.49, ingredient: 'Feuilles de lasagnes' },
      { productId: 102, productName: 'Pur bœuf haché 15 % MG', variantId: 1002, variantName: 'Barquette de 350 g', quantity: 2, unitPrice: 4.9, subtotal: 9.8, ingredient: 'Bœuf haché' },
      { productId: 103, productName: 'Tomates concassées', variantId: null, variantName: null, quantity: 2, unitPrice: 1.25, subtotal: 2.5, ingredient: 'Tomates' },
      { productId: 104, productName: 'Emmental râpé', variantId: 1004, variantName: 'Sachet de 200 g', quantity: 1, unitPrice: 2.19, subtotal: 2.19, ingredient: 'Fromage râpé' },
    ].filter(item => !excluded.has(item.productId));
    const plan = {
      planId: `plan-${plans.size + 1}`, ...body, items,
      missingIngredients: ['Noix de muscade'],
      warnings: ['Vérifiez si vous avez déjà de l’huile, du sel et du poivre.', 'Le choix de marque demandé n’est pas disponible pour tous les ingrédients.'],
      total: Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100,
      expiresAt: new Date(Date.now() + settings.expiryMs).toISOString(),
    };
    plans.set(plan.planId, plan);
    return send(res, 200, plan);
  }
  if (req.url === '/api/recipe-basket/commit') {
    calls.push({ path: req.url, body });
    await new Promise(resolve => setTimeout(resolve, settings.commitDelay));
    if (settings.commitFailures-- > 0) return send(res, settings.commitStatus, { message: settings.commitStatus === 409 || settings.commitStatus === 410
      ? 'Ce panier recette a expiré ou la boutique a changé.' : 'Connexion interrompue pendant la confirmation.' });
    const plan = plans.get(body.planId);
    if (!plan || Date.parse(plan.expiresAt) <= Date.now()) return send(res, 409, { message: 'Ce panier recette a expiré ou la boutique a changé.' });
    if (!committed.has(body.planId)) {
      committed.add(body.planId);
      const skipped = new Set((body.excludedItems ?? []).map(item => `${item.productId}:${item.variantId ?? ''}`));
      const selected = plan.items.filter(item => !skipped.has(`${item.productId}:${item.variantId ?? ''}`));
      cart.items.push(...selected);
      cart.total = Math.round((cart.total + selected.reduce((sum, item) => sum + item.subtotal, 0)) * 100) / 100;
      cart.itemCount += selected.reduce((count, item) => count + item.quantity, 0);
    }
    if (settings.dropCommitResponses-- > 0) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Content-Length': '1000', Connection: 'close' });
      return res.end('{"items":');
    }
    return send(res, 200, cart);
  }
  return send(res, 404, { message: 'Not found' });
}).listen(5185, '127.0.0.1', () => console.log('Recipe UI mock API listening on 5185'));
