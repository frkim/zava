/**
 * Offline tests: the extraction function is run against fake Carrefour-, Celio-
 * and Decathlon-like product pages served from a local HTTP server, so the
 * parsing and the Zava mapping can be validated without hitting the real sites.
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { chromium } from 'playwright';
import { extractProductInPage, extractSearchResultsInPage } from '../src/extract.js';
import { guessCategoryId, toZavaProduct } from '../src/mapToZava.js';
import { SITES, extractionConfig, getSite, searchUrl } from '../src/sites.js';
import { slugify } from '../src/store.js';

const PRODUCT_HTML = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Nutella Pâte à tartiner 750g | Carrefour</title>
<meta name="description" content="Pâte à tartiner aux noisettes et au cacao.">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"Nutella Pâte à tartiner noisettes 750g",
 "description":"Pâte à tartiner aux noisettes et au cacao, sans huile de palme ajoutée.",
 "brand":{"@type":"Brand","name":"Nutella"},"gtin13":"3017620425035","sku":"NUT750",
 "image":["https://media.carrefour.fr/medias/nutella-750-main.jpg","https://media.carrefour.fr/medias/nutella-750-back.jpg"],
 "aggregateRating":{"@type":"AggregateRating","ratingValue":4.6,"reviewCount":1280},
 "offers":{"@type":"Offer","price":"4.95","priceCurrency":"EUR","availability":"https://schema.org/InStock"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Accueil"},
 {"@type":"ListItem","position":2,"name":"Épicerie Sucrée"},
 {"@type":"ListItem","position":3,"name":"Pâtes à tartiner"}]}
</script>
</head><body>
<h1>Nutella Pâte à tartiner noisettes 750g</h1>
<div class="product-description"><p>Le goût unique de Nutella pour des petits déjeuners gourmands.</p>
<ul><li>Sans huile de palme ajoutée</li><li>Source de calcium</li></ul></div>
<table><tr><th>Contenance</th><td>750 g</td></tr><tr><th>Conservation</th><td>À température ambiante</td></tr></table>
<div class="nutrition"><table><tr><th>Énergie</th><td>2252 kJ</td></tr></table></div>
<div class="gallery"><img src="https://media.carrefour.fr/medias/nutella-750-main.jpg">
<img src="https://media.carrefour.fr/medias/logo.svg">
<img srcset="https://media.carrefour.fr/medias/nutella-750-side-small.jpg 300w, https://media.carrefour.fr/medias/nutella-750-side.jpg 900w"></div>
</body></html>`;

const PDP_HTML = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Milk mix Nesquik | Carrefour</title>
<meta name="description" content="le sachet de 350g">
</head><body>
<h1>Boisson en poudre vanille Milk mix NESQUIK</h1>
<div class="product-price product-price--size-l">
  <div class="product-price__amounts">
    <div class="product-price__amount product-price__amount--main">
      <p class="product-price__content"> 3 </p><p class="product-price__content"> ,49 </p><p class="product-price__content"> € </p>
    </div>
  </div>
</div>
<div class="infos-accordion">
  <div class="infos-accordion__section">
    <div class="infos-accordion__section-header"><p aria-hidden="true"> Nom légal </p></div>
    <div class="infos-accordion__section-content">Poudre instantanée pour boisson au goût vanille, enrichie en vitamines et minéraux.</div>
  </div>
  <div class="infos-accordion__section">
    <div class="infos-accordion__section-header"><p aria-hidden="true"> Ingrédients </p></div>
    <div class="infos-accordion__section-content">Sucre, lactosérum, arôme vanille, vitamines.</div>
  </div>
</div>
<div class="nutritional-details">
  <div class="nutritional-details__table-body">
    <div class="nutritional-details__table-row">
      <div class="nutritional-details__table-column"><span> valeur énergétique (kJ) </span></div>
      <div class="nutritional-details__table-column nutritional-details__table-column--right"><span> 296 kJ / 100 </span></div>
    </div>
  </div>
</div>
<div class="pdp-hero__images">
  <img src="https://media.carrefour.fr/medias/ref/media/8445291634381/p_200x200/nesquik.png">
  <img src="https://media.carrefour.fr/medias/ref/media/8445291634381/p_1500x1500/nesquik.png">
  <img src="https://media.carrefour.fr/medias/ref/media/8445291634381/p_43x43/nesquik.png">
  <img src="https://bat.bing.com/action/0">
</div>
</body></html>`;

const SEARCH_HTML = `<!doctype html><html><body>
<a href="/p/nutella-pate-a-tartiner-750g/3017620425035">Nutella</a>
<a href="/p/cafe-grain-1kg/1234567890123">Café</a>
<a href="/r/epicerie">Rayon</a>
<a href="/p/nutella-pate-a-tartiner-750g/3017620425035?utm=1">Nutella again</a>
</body></html>`;


const CELIO_HTML = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Chemise coupe droite en lin | Celio</title>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"Chemise coupe droite en lin bleu",
 "description":"Chemise 100% lin, coupe droite, col français, idéale pour l'été.",
 "brand":{"@type":"Brand","name":"Celio"},"sku":"NALINO_BLEU",
 "image":["https://www.celio.com/dw/image/v2/BDPQ/on/demandware.static/chemise-lin-1500x1500.jpg"],
 "offers":{"@type":"Offer","price":"39.99","priceCurrency":"EUR"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Accueil"},
 {"@type":"ListItem","position":2,"name":"Chemises Homme"}]}
</script>
</head><body>
<h1>Chemise coupe droite en lin bleu</h1>
<dl><dt>Composition</dt><dd>100% lin</dd><dt>Taille</dt><dd>M</dd></dl>
<div class="gallery">
  <img src="https://www.celio.com/dw/image/v2/BDPQ/on/demandware.static/chemise-lin-1500x1500.jpg">
  <img src="https://www.facebook.com/tr?id=1">
</div>
</body></html>`;

const CELIO_SEARCH_HTML = `<!doctype html><html><body>
<a href="/fr-fr/chemise-coupe-droite-lin/NALINO_BLEU.html">Chemise</a>
<a href="/fr-fr/pull-col-rond/NAPULL_GRIS.html">Pull</a>
<a href="/fr-fr/c/homme/chemises">Rayon chemises</a>
</body></html>`;

const DECATHLON_HTML = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Chaussures de running Kiprun KS500 - Decathlon</title>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"Chaussures de running Kiprun KS500",
 "description":"Chaussure de running polyvalente avec amorti dynamique pour vos sorties longues.",
 "brand":{"@type":"Brand","name":"Kiprun"},"sku":"8600821",
 "image":["https://contents.mediadecathlon.com/p2394806/ks500.jpg"],
 "offers":{"@type":"Offer","price":"59.99","priceCurrency":"EUR"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Accueil"},
 {"@type":"ListItem","position":2,"name":"Running"},
 {"@type":"ListItem","position":3,"name":"Chaussures de running homme"}]}
</script>
</head><body>
<h1>Chaussures de running Kiprun KS500</h1>
<table><tr><th>Pointure</th><td>42</td></tr></table>
<div class="gallery">
  <img src="https://contents.mediadecathlon.com/p2394806/ks500.jpg">
  <img src="https://www.google-analytics.com/collect.png">
</div>
</body></html>`;

const DECATHLON_SEARCH_HTML = `<!doctype html><html><body>
<a href="/p/chaussures-running-kiprun-ks500/_/R-p-306045">KS500</a>
<a href="/p/velo-vtt-rockrider-st100/_/R-p-301234?mc=8512345">Rockrider</a>
<a href="/tous-les-sports/running">Univers running</a>
</body></html>`;

function startServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    if (req.url.startsWith('/celio-search')) res.end(CELIO_SEARCH_HTML);
    else if (req.url.startsWith('/decathlon-search')) res.end(DECATHLON_SEARCH_HTML);
    else if (req.url.startsWith('/celio')) res.end(CELIO_HTML);
    else if (req.url.startsWith('/decathlon')) res.end(DECATHLON_HTML);
    else if (req.url.startsWith('/s')) res.end(SEARCH_HTML);
    else if (req.url.startsWith('/pdp')) res.end(PDP_HTML);
    else res.end(PRODUCT_HTML);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

test('extracts product data, features and images from a product page', async (t) => {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/p/nutella`);
  const product = await page.evaluate(extractProductInPage);

  assert.equal(product.name, 'Nutella Pâte à tartiner noisettes 750g');
  assert.equal(product.brand, 'Nutella');
  assert.match(product.description, /noisettes et au cacao/);
  assert.equal(product.price, 4.95);
  assert.equal(product.currency, 'EUR');
  assert.equal(product.ean, '3017620425035');
  assert.equal(product.rating, 4.6);
  assert.equal(product.reviewCount, 1280);
  assert.deepEqual(product.breadcrumbs, ['Accueil', 'Épicerie Sucrée', 'Pâtes à tartiner']);

  const labels = product.features.map((f) => `${f.label}|${f.value}`);
  assert.ok(labels.includes('Contenance|750 g'), 'contenance feature missing');
  assert.ok(labels.includes('Conservation|À température ambiante'), 'conservation feature missing');
  assert.ok(
    product.features.some((f) => f.value === 'Sans huile de palme ajoutée'),
    'bullet feature missing',
  );

  assert.ok(product.images.includes('https://media.carrefour.fr/medias/nutella-750-main.jpg'));
  assert.ok(product.images.includes('https://media.carrefour.fr/medias/nutella-750-side.jpg'));
  assert.ok(!product.images.some((url) => url.endsWith('.svg')), 'svg logo should be filtered out');

  assert.ok(product.nutrition.some((entry) => entry.value === '2252 kJ'));
});

test('parses the real Carrefour grocery layout (split price, accordions, media sizes)', async (t) => {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/pdp`);
  const product = await page.evaluate(extractProductInPage);

  // The amount is split across nodes: "3" + ",49" + "€".
  assert.equal(product.price, 3.49);

  const labels = product.features.map((f) => f.label);
  assert.ok(labels.includes('Nom légal'), 'accordion sections should become features');
  assert.ok(labels.includes('Ingrédients'), 'ingredients section missing');

  // The accordion copy is richer than the meta description.
  assert.match(product.description, /Poudre instantanée/);

  assert.deepEqual(product.nutrition, [
    { label: 'valeur énergétique (kJ)', value: '296 kJ / 100' },
  ]);

  assert.deepEqual(
    product.images,
    ['https://media.carrefour.fr/medias/ref/media/8445291634381/p_1500x1500/nesquik.png'],
    'size variants should collapse to the largest and trackers be dropped',
  );
});

test('collects unique product links from a search page', async (t) => {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/s?q=nutella`);
  const links = await page.evaluate(extractSearchResultsInPage);

  assert.equal(links.length, 2, 'query strings should be normalised and non-product links dropped');
  assert.ok(links.every((link) => link.includes('/p/')));
});

test('maps a scraped product onto the Zava seeder shape', () => {
  const scraped = {
    name: 'Nutella Pâte à tartiner noisettes 750g',
    brand: 'Nutella',
    description: 'Pâte à tartiner aux noisettes.',
    price: 4.95,
    ean: '3017620425035',
    breadcrumbs: ['Accueil', 'Épicerie Sucrée'],
    features: [
      { label: 'Contenance', value: '750 g' },
      { label: '', value: 'Sans huile de palme ajoutée' },
    ],
    images: [],
  };

  const zava = toZavaProduct(scraped, { id: 42, stock: 50 });

  assert.equal(zava.id, 42);
  assert.equal(zava.categoryId, 7, 'Épicerie Sucrée maps to category 7');
  assert.equal(zava.name, scraped.name);
  assert.equal(zava.nameEn, scraped.name);
  assert.equal(zava.price, 4.95);
  assert.equal(zava.stock, 50);
  assert.equal(zava.sku, 'NUTELL-20425035');
  assert.match(zava.description, /Contenance : 750 g/);
  assert.equal(zava.variants.length, 1);
  assert.equal(zava.variants[0].value, '750 g');
  assert.equal(zava.variants[0].stock, 50);
  assert.ok(zava.tags.includes('Nutella'));

  // The generated object must expose exactly the seeder JSON keys.
  assert.deepEqual(
    Object.keys(zava).sort(),
    [
      'brand', 'categoryId', 'description', 'descriptionEn', 'id', 'isBestSeller',
      'isFeatured', 'isNew', 'isPromo', 'name', 'nameEn', 'price', 'sku', 'stock',
      'tags', 'variants',
    ].sort(),
  );
});

test('category guessing falls back to savoury grocery', () => {
  assert.equal(guessCategoryId({ breadcrumbs: ['Accueil', 'Boissons'], name: 'Jus' }), 8);
  assert.equal(guessCategoryId({ breadcrumbs: ['Accueil'], name: 'Objet inconnu' }), 6);
  assert.equal(guessCategoryId({ breadcrumbs: [], name: 'Filet de saumon' }), 5);
});

test('category guessing ignores accents and prefers the aisle crumb', () => {
  const nesquik = {
    breadcrumbs: [
      "Aller à l'accueil",
      'Rayons',
      'Epicerie sucrée',
      'Thés, Infusions et Boissons chaudes',
      'Chocolats en poudre',
    ],
    name: 'Boisson en poudre vanille Milk mix NESQUIK',
  };
  assert.equal(guessCategoryId(nesquik), 7, 'unaccented aisle crumb must still map to Épicerie sucrée');
});

test('extracts a Celio product with the clothing profile', async (t) => {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const site = getSite('celio');
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/celio/chemise.html`);
  const product = await page.evaluate(extractProductInPage, extractionConfig(site));

  assert.equal(product.name, 'Chemise coupe droite en lin bleu');
  assert.equal(product.brand, 'Celio');
  assert.equal(product.price, 39.99);
  assert.ok(
    product.features.some((f) => f.label === 'Composition' && f.value === '100% lin'),
    'definition list should become features',
  );
  assert.deepEqual(
    product.images,
    ['https://www.celio.com/dw/image/v2/BDPQ/on/demandware.static/chemise-lin-1500x1500.jpg'],
    'only Celio hosted pictures should be kept',
  );

  const zava = toZavaProduct(product, { id: 1, stock: 40, site });
  assert.equal(zava.categoryId, 1, '"Chemises Homme" maps to the first clothing category');
  assert.equal(zava.variants[0].value, 'M', 'the size feature becomes the variant');
  assert.equal(zava.sku, 'CELIO-CHEMISECOU');
});

test('extracts a Decathlon product with the sports profile', async (t) => {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const site = getSite('decathlon');
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/decathlon/p/ks500`);
  const product = await page.evaluate(extractProductInPage, extractionConfig(site));

  assert.equal(product.name, 'Chaussures de running Kiprun KS500');
  assert.equal(product.brand, 'Kiprun');
  assert.equal(product.price, 59.99);
  assert.deepEqual(
    product.images,
    ['https://contents.mediadecathlon.com/p2394806/ks500.jpg'],
    'only Decathlon media hosts should be kept',
  );

  const zava = toZavaProduct(product, { id: 1, stock: 40, site });
  assert.equal(zava.categoryId, 1, '"Running" maps to the first sports category');
  assert.equal(zava.variants[0].value, '42', 'the pointure feature becomes the variant');
});

test('collects product links with the per-site link patterns', async (t) => {
  const server = await startServer();
  const port = server.address().port;
  const browser = await chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });

  const page = await browser.newPage();

  await page.goto(`http://127.0.0.1:${port}/celio-search?q=chemise`);
  const celioLinks = await page.evaluate(extractSearchResultsInPage, extractionConfig(getSite('celio')));
  assert.deepEqual(
    celioLinks.map((link) => new URL(link).pathname).sort(),
    ['/fr-fr/chemise-coupe-droite-lin/NALINO_BLEU.html', '/fr-fr/pull-col-rond/NAPULL_GRIS.html'],
  );

  await page.goto(`http://127.0.0.1:${port}/decathlon-search?Ntt=running`);
  const decathlonLinks = await page.evaluate(
    extractSearchResultsInPage,
    extractionConfig(getSite('decathlon')),
  );
  assert.deepEqual(
    decathlonLinks.map((link) => new URL(link).pathname).sort(),
    ['/p/chaussures-running-kiprun-ks500/_/R-p-306045', '/p/velo-vtt-rockrider-st100/_/R-p-301234'],
    'query strings should be normalised and non-product links dropped',
  );
});

test('site profiles expose the Zava store types and search urls', () => {
  assert.deepEqual(
    Object.values(SITES).map((site) => site.siteType),
    ['Grocery', 'Clothing', 'Sports'],
  );
  assert.equal(searchUrl(SITES.carrefour, 'café'), 'https://www.carrefour.fr/s?q=caf%C3%A9');
  assert.equal(searchUrl(SITES.celio, 'chemise'), 'https://www.celio.com/fr-fr/search?q=chemise');
  assert.equal(searchUrl(SITES.decathlon, 'running'), 'https://www.decathlon.fr/search?Ntt=running');
  assert.throws(() => getSite('unknown'), /Known sites: carrefour, celio, decathlon/);
});

test('category guessing uses the categories of the selected site', () => {
  const site = getSite('decathlon');
  assert.equal(guessCategoryId({ breadcrumbs: ['Accueil', 'Vélo'], name: 'VTT' }, site), 5);
  assert.equal(guessCategoryId({ breadcrumbs: [], name: 'Tapis de yoga confort' }, site), 10);
  assert.equal(guessCategoryId({ breadcrumbs: ['Accueil'], name: 'Objet inconnu' }, site), 2);
});

test('slugify produces safe folder names', () => {
  assert.equal(slugify('Nutella Pâte à tartiner 750g'), 'nutella-pate-a-tartiner-750g');
  assert.equal(slugify('   '), 'produit');
});
