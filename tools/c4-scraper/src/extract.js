/**
 * Product data extraction.
 *
 * Carrefour product pages expose a schema.org Product payload in a JSON-LD
 * script tag, which is the most stable source for name / description / brand /
 * price / images. DOM selectors are used as a fallback and to collect the
 * "caractéristiques" feature list and the full gallery.
 */

/** Runs inside the page and returns the raw product payload. */
export function extractProductInPage() {
  const text = (node) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();

  const jsonLd = [];
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(script.textContent ?? 'null');
      if (Array.isArray(parsed)) jsonLd.push(...parsed);
      else if (parsed) jsonLd.push(parsed);
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }

  const flatten = (nodes) => {
    const out = [];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;
      out.push(node);
      if (Array.isArray(node['@graph'])) out.push(...node['@graph']);
    }
    return out;
  };

  const typeOf = (node) => {
    const raw = node?.['@type'];
    return Array.isArray(raw) ? raw.map(String) : raw ? [String(raw)] : [];
  };

  const all = flatten(jsonLd);
  const product = all.find((node) => typeOf(node).includes('Product')) ?? null;
  const breadcrumbNode = all.find((node) => typeOf(node).includes('BreadcrumbList'));

  const meta = (selector, attribute = 'content') =>
    document.querySelector(selector)?.getAttribute(attribute)?.trim() || '';

  // --- Name -----------------------------------------------------------------
  const name =
    product?.name ||
    text(document.querySelector('h1')) ||
    meta('meta[property="og:title"]') ||
    document.title.replace(/\s*\|\s*Carrefour.*$/i, '').trim();

  // --- Description ----------------------------------------------------------
  const descriptionSelectors = [
    '[class*="product-description"]',
    '[data-testid*="description"]',
    '#description',
    '[class*="ProductDescription"]',
    '[class*="pdp-description"]',
  ];
  let domDescription = '';
  for (const selector of descriptionSelectors) {
    const node = document.querySelector(selector);
    const value = text(node);
    if (value.length > domDescription.length) domDescription = value;
  }
  // Grocery pages have no marketing copy block; the legal name / product
  // presentation lives in the "Informations complémentaires" accordion.
  for (const section of document.querySelectorAll('.infos-accordion__section')) {
    const label = text(section.querySelector('.infos-accordion__section-header p, [aria-hidden="true"]'));
    if (!/description|nom l[ée]gal|pr[ée]sentation/i.test(label)) continue;
    const value = text(section.querySelector('.infos-accordion__section-content'));
    if (value.length > domDescription.length) domDescription = value.slice(0, 600);
  }
  const ldDescription = product?.description ? String(product.description).trim() : '';
  // The meta description is padded with store SEO copy ("... à retrouver en
  // drive ou livraison au meilleur prix dans le rayon X. Profitez de nos
  // promotions ...") that says nothing about the product.
  const stripBoilerplate = (value) =>
    value
      .replace(/\s*à retrouver en drive.*$/is, '')
      .replace(/\s*Profitez de nos promotions.*$/is, '')
      .replace(/\s*En savoir plus\s*$/i, '')
      .trim();

  const descriptionCandidates = [
    ldDescription,
    domDescription,
    meta('meta[name="description"]'),
    meta('meta[property="og:description"]'),
  ]
    .map(stripBoilerplate)
    .filter(Boolean);
  // The structured description is authoritative when it actually says
  // something; grocery pages often reduce it to a pack size ("le sachet de
  // 350g"), in which case the richest text on the page wins instead.
  const description = (() => {
    const strippedLd = stripBoilerplate(ldDescription);
    if (strippedLd.length >= 60) return strippedLd;
    return descriptionCandidates.sort((a, b) => b.length - a.length)[0] ?? '';
  })();

  // --- Features -------------------------------------------------------------
  const features = [];
  const pushFeature = (label, value) => {
    const cleanLabel = (label ?? '').replace(/\s*:\s*$/, '').trim();
    const cleanValue = (value ?? '').trim();
    if (!cleanLabel && !cleanValue) return;
    const key = `${cleanLabel}|${cleanValue}`.toLowerCase();
    if (features.some((f) => `${f.label}|${f.value}`.toLowerCase() === key)) return;
    // Unlabelled blocks often repeat a labelled section verbatim.
    if (!cleanLabel && features.some((f) => f.value.toLowerCase() === cleanValue.toLowerCase())) return;
    features.push({ label: cleanLabel, value: cleanValue });
  };

  // "Informations complémentaires" accordion: the main source of grocery facts
  // (Nom légal, Ingrédients, Conseils conso, Conservation, ...).
  for (const section of document.querySelectorAll('.infos-accordion__section')) {
    const label = text(section.querySelector('.infos-accordion__section-header p, [aria-hidden="true"]'));
    const value = text(section.querySelector('.infos-accordion__section-content'));
    if (label && value) pushFeature(label, value.slice(0, 600));
  }
  // Badge blocks used for consumption advice and claims.
  for (const badge of document.querySelectorAll('.product-badge-description')) {
    const value = text(badge);
    if (value && value.length <= 400) pushFeature('', value);
  }

  // Definition lists and characteristic tables.
  for (const row of document.querySelectorAll('table tr')) {
    const cells = row.querySelectorAll('th, td');
    if (cells.length >= 2) pushFeature(text(cells[0]), text(cells[1]));
  }
  for (const list of document.querySelectorAll('dl')) {
    const terms = [...list.querySelectorAll('dt')];
    const values = [...list.querySelectorAll('dd')];
    terms.forEach((term, index) => pushFeature(text(term), text(values[index])));
  }
  // Generic "label: value" blocks used on characteristic panels.
  for (const node of document.querySelectorAll(
    '[class*="characteristic"], [class*="caracteristique"], [class*="product-attribute"], [class*="specification"]',
  )) {
    const label = text(node.querySelector('[class*="label"], [class*="name"], strong, b'));
    const value = text(node.querySelector('[class*="value"], [class*="content"], span:last-child'));
    if (label && value && label !== value) pushFeature(label, value);
  }
  // Bullet lists inside the description area.
  for (const item of document.querySelectorAll(
    '[class*="description"] li, [class*="benefit"] li, [class*="argument"] li',
  )) {
    const value = text(item);
    if (value && value.length <= 240) pushFeature('', value);
  }
  // Structured additional properties from JSON-LD.
  const additional = product?.additionalProperty;
  if (Array.isArray(additional)) {
    for (const entry of additional) pushFeature(entry?.name, String(entry?.value ?? ''));
  }

  // --- Nutrition / allergens (grocery specific) ------------------------------
  const nutrition = [];
  const pushNutrition = (label, value) => {
    const cleanLabel = (label ?? '').trim();
    const cleanValue = (value ?? '').trim();
    if (!cleanLabel || !cleanValue) return;
    if (nutrition.some((n) => n.label.toLowerCase() === cleanLabel.toLowerCase())) return;
    nutrition.push({ label: cleanLabel, value: cleanValue });
  };
  // Carrefour renders the nutrition grid with divs, not a <table>.
  for (const row of document.querySelectorAll('.nutritional-details__table-row')) {
    const columns = row.querySelectorAll('.nutritional-details__table-column');
    if (columns.length >= 2) pushNutrition(text(columns[0]), text(columns[1]));
  }
  for (const table of document.querySelectorAll(
    '[class*="nutrition"] table, table[class*="nutrition"]',
  )) {
    for (const row of table.querySelectorAll('tr')) {
      const cells = row.querySelectorAll('th, td');
      if (cells.length >= 2) pushNutrition(text(cells[0]), text(cells[1]));
    }
  }

  // --- Images ---------------------------------------------------------------
  // Carrefour serves the same media in several sizes
  // (.../media/<id>/p_200x200/file.png, .../p_1500x1500/file.png) and the page
  // also contains third-party tracking pixels: keep one entry per media, at the
  // largest available size, and only from Carrefour hosts.
  const imageBySignature = new Map();
  const addImage = (value) => {
    if (!value) return;
    const raw = String(value).split('?')[0];
    if (!/^https?:\/\//i.test(raw)) return;
    if (/sprite|logo|placeholder|icon|pixel|\.svg$/i.test(raw)) return;
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      return;
    }
    if (!/(^|\.)carrefour\.(fr|com|eu)$/i.test(parsed.hostname)) return;

    const sizeMatch = parsed.pathname.match(/\/[a-z]*_?(\d{2,5})x(\d{2,5})\//i);
    const area = sizeMatch ? Number(sizeMatch[1]) * Number(sizeMatch[2]) : 0;
    const signature = parsed.pathname
      .replace(/\/[a-z]*_?\d{2,5}x\d{2,5}\//i, '/')
      .toLowerCase();

    const existing = imageBySignature.get(signature);
    if (!existing || area > existing.area) imageBySignature.set(signature, { url: raw, area });
  };
  const productImage = product?.image;
  if (Array.isArray(productImage)) productImage.forEach(addImage);
  else if (typeof productImage === 'string') addImage(productImage);
  else if (productImage?.url) addImage(productImage.url);
  addImage(meta('meta[property="og:image"]'));
  for (const img of document.querySelectorAll(
    'img[src*="carrefour"], [class*="gallery"] img, [class*="carousel"] img, [class*="product-media"] img, picture img',
  )) {
    addImage(img.getAttribute('src'));
    const srcset = img.getAttribute('srcset');
    if (srcset) {
      const largest = srcset
        .split(',')
        .map((part) => part.trim().split(/\s+/)[0])
        .filter(Boolean)
        .pop();
      addImage(largest);
    }
  }

  // --- Offer / identifiers ---------------------------------------------------
  const offer = Array.isArray(product?.offers) ? product.offers[0] : product?.offers;
  const priceText = text(
    document.querySelector(
      '.product-price__amount--main, [class*="product-price"], [data-testid*="price"], [class*="ProductPrice"]',
    ),
  );
  const parsedPrice = (() => {
    const fromLd = Number(offer?.price);
    if (Number.isFinite(fromLd) && fromLd > 0) return fromLd;
    // The amount is split across several nodes ("3" / ",49" / "€"), so the text
    // content ends up as "3 ,49 €"; thousands are grouped with spaces too.
    const normalized = priceText.replace(/[\s\u00a0\u202f]/g, '');
    const match = normalized.match(/(\d+(?:[.,]\d{1,2})?)/);
    if (!match) return null;
    const value = Number(match[1].replace(',', '.'));
    return Number.isFinite(value) && value > 0 ? value : null;
  })();

  const breadcrumbs = Array.isArray(breadcrumbNode?.itemListElement)
    ? breadcrumbNode.itemListElement
        .map((entry) => entry?.name || entry?.item?.name)
        .filter(Boolean)
        .map(String)
    : [...document.querySelectorAll('nav[aria-label*="fil"] a, [class*="breadcrumb"] a')]
        .map((node) => text(node))
        .filter(Boolean);

  const brand =
    (typeof product?.brand === 'string' ? product.brand : product?.brand?.name) ||
    text(document.querySelector('[class*="brand"] a, [class*="product-brand"]')) ||
    '';

  return {
    url: location.href,
    name,
    brand: String(brand).trim(),
    description,
    features,
    nutrition,
    images: [...imageBySignature.values()]
      .sort((a, b) => b.area - a.area)
      .map((entry) => entry.url),
    price: parsedPrice,
    priceText,
    currency: offer?.priceCurrency ?? 'EUR',
    availability: offer?.availability ?? '',
    ean: product?.gtin13 || product?.gtin || product?.gtin14 || '',
    sku: product?.sku || product?.mpn || '',
    rating: Number(product?.aggregateRating?.ratingValue) || null,
    reviewCount: Number(product?.aggregateRating?.reviewCount) || null,
    breadcrumbs,
    scrapedAt: new Date().toISOString(),
  };
}

/** Collects product links from a search-result or category page. */
export function extractSearchResultsInPage() {
  const links = new Set();
  for (const anchor of document.querySelectorAll('a[href*="/p/"]')) {
    const href = anchor.getAttribute('href');
    if (!href) continue;
    const url = new URL(href, location.origin);
    if (!url.pathname.includes('/p/')) continue;
    links.add(`${url.origin}${url.pathname}`);
  }
  return [...links];
}
