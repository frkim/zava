/**
 * Navigation flow.
 *
 * The scraper walks the site the way a shopper would: open the home page,
 * dismiss the cookie banner, type in the search box, look at the result list,
 * click a product tile, read the sheet and open the picture gallery.
 * Direct URL navigation is only used when the caller passes explicit product URLs.
 *
 * Everything shop specific (URLs, banners, link shape, image hosts) comes from
 * the site profile in `sites.js`, so the same flow serves carrefour.fr,
 * celio.com and decathlon.fr.
 */

import path from 'node:path';
import { extractProductInPage, extractSearchResultsInPage } from './extract.js';
import {
  humanClick,
  humanScroll,
  humanType,
  pause,
  read,
  scrollToTop,
  sleep,
  withTimeout,
} from './human.js';
import { ensureDir, slugify, writeBinary, writeJson, writeText } from './store.js';
import { DEFAULT_SITE, extractionConfig, searchUrl } from './sites.js';

/** Opens the home page and settles the session (cookie banner, first look around). */
export async function openHomePage(page, log, site = DEFAULT_SITE) {
  log(`Opening ${new URL(site.home).hostname}…`);
  await page.goto(site.home, { waitUntil: 'domcontentloaded' });
  await pause(1200, 2600);
  await acceptCookies(page, log, site);
  await read(page, 1200, 2600);
  await humanScroll(page, { steps: 2 });
  await scrollToTop(page);
  await reportChallenge(page, log);
}

/**
 * Warns when the site served an anti-bot interstitial instead of the real page.
 * Running without --headless is usually enough to get the normal page back.
 */
async function reportChallenge(page, log) {
  const title = await withTimeout(page.title(), 5000, '');
  const blocked = /just a moment|verif|robot|access denied|attention required/i.test(title);
  if (blocked) log(`⚠ The site returned a verification page ("${title}"). Retry without --headless.`);
  return blocked;
}

async function acceptCookies(page, log, site = DEFAULT_SITE) {
  for (const selector of site.cookieSelectors) {
    const button = page.locator(selector).first();
    if ((await withTimeout(button.count(), 5000, 0)) === 0) continue;
    if (await humanClick(page, button, { timeout: 4000 })) {
      log('Cookie banner accepted.');
      await pause(700, 1600);
      return true;
    }
  }
  return false;
}

/** Types a query in the search bar and returns the product URLs found. */
export async function searchProducts(page, query, limit, log, site = DEFAULT_SITE) {
  log(`Searching for "${query}"…`);

  let searchBox = null;
  for (const selector of site.searchSelectors) {
    const candidate = page.locator(selector).first();
    const count = await withTimeout(candidate.count(), 5000, 0);
    if (count > 0 && (await withTimeout(candidate.isVisible(), 5000, false))) {
      searchBox = candidate;
      break;
    }
  }

  if (searchBox) {
    await humanType(page, searchBox, query);
    await withTimeout(page.keyboard.press('Enter'), 5000);
    await withTimeout(page.waitForLoadState('domcontentloaded'), 20000);
  } else {
    // The header search is sometimes rendered late; fall back to the search URL.
    log('Search box not reachable, using the search page directly.');
    await page.goto(searchUrl(site, query), { waitUntil: 'domcontentloaded' });
  }

  await pause(1500, 3000);
  await acceptCookies(page, log, site);
  await humanScroll(page, { steps: 4 });

  let urls = await collectResultLinks(page, site);

  // The header search sometimes lands on a suggestion page; retry on the search URL.
  if (!urls.length && page.url() !== searchUrl(site, query)) {
    log('No result on this page, opening the search results page…');
    await page.goto(searchUrl(site, query), { waitUntil: 'domcontentloaded' });
    await pause(1500, 3000);
    await acceptCookies(page, log, site);
    await humanScroll(page, { steps: 4 });
    urls = await collectResultLinks(page, site);
  }

  if (!urls.length) await reportChallenge(page, log);
  log(`Found ${urls.length} product link(s).`);
  return urls.slice(0, limit);
}

const collectResultLinks = (page, site) =>
  withTimeout(page.evaluate(extractSearchResultsInPage, extractionConfig(site)), 15000, []);

/**
 * Opens a product page, reads it like a human and extracts the product data.
 * @returns {Promise<object>} raw product payload
 */
export async function scrapeProduct(page, url, log, { saveHtml = false, site = DEFAULT_SITE } = {}) {
  log(`Opening product page: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await pause(1200, 2600);
  await acceptCookies(page, log, site);

  // Read the sheet top-to-bottom, expanding the collapsible detail sections.
  await read(page, 1400, 3000);
  await humanScroll(page, { steps: 5 });
  await expandDetails(page);
  await humanScroll(page, { steps: 4 });
  await browseGallery(page);

  const product = await withTimeout(
    page.evaluate(extractProductInPage, extractionConfig(site)),
    20000,
    null,
  );
  if (!product) throw new Error('Product extraction timed out');
  product.sourceUrl = url;

  if (saveHtml) product.html = await withTimeout(page.content(), 15000, '');
  return product;
}

/** Clicks the "caractéristiques" / "en savoir plus" accordions so their content renders. */
async function expandDetails(page) {
  // Collapsed accordion panels ("Nom légal", "Ingrédients", "Conservation", ...)
  // keep their content out of reach until the chevron is clicked.
  const collapsed = page.locator('.infos-accordion__section-header button[aria-expanded="false"]');
  const collapsedCount = Math.min(await withTimeout(collapsed.count(), 5000, 0), 8);
  for (let i = 0; i < collapsedCount; i += 1) {
    await humanClick(page, collapsed.nth(i), { timeout: 2500 });
    await pause(300, 900);
  }

  const labels = [
    /caract[ée]ristiques/i,
    /description/i,
    /en savoir plus/i,
    /informations/i,
    /composition/i,
    /nutrition/i,
  ];
  for (const label of labels) {
    const button = page.getByRole('button', { name: label }).first();
    if ((await withTimeout(button.count(), 5000, 0)) === 0) continue;
    await humanClick(page, button, { timeout: 3000 });
    await pause(500, 1200);
  }
}

/** Clicks through the picture thumbnails so every gallery image is loaded. */
async function browseGallery(page) {
  const thumbs = page.locator('[class*="thumbnail"] img, [class*="gallery"] button, [class*="carousel"] button');
  const count = Math.min(await withTimeout(thumbs.count(), 5000, 0), 5);
  for (let i = 0; i < count; i += 1) {
    await humanClick(page, thumbs.nth(i), { timeout: 2500 });
    await pause(400, 1100);
  }
}

/**
 * Downloads product pictures through the browser context so cookies and headers
 * match the browsing session.
 */
export async function downloadImages(context, product, targetDir, log, limit = 6, site = DEFAULT_SITE) {
  const dir = await ensureDir(path.join(targetDir, 'images'));
  const saved = [];

  for (const [index, url] of product.images.slice(0, limit).entries()) {
    try {
      const response = await context.request.get(url, {
        headers: { referer: product.sourceUrl ?? site.home },
        timeout: 20000,
      });
      if (!response.ok()) continue;

      const body = await response.body();
      if (body.length < 1024) continue; // skip tracking pixels / broken images

      const contentType = response.headers()['content-type'] ?? '';
      const extension =
        (contentType.includes('png') && 'png') ||
        (contentType.includes('webp') && 'webp') ||
        (contentType.includes('avif') && 'avif') ||
        (path.extname(new URL(url).pathname).replace('.', '') || 'jpg');

      const file = path.join(dir, `${String(index + 1).padStart(2, '0')}-${slugify(product.name)}.${extension}`);
      await writeBinary(file, body);
      saved.push({ url, file, bytes: body.length });
      await sleep(300 + Math.random() * 700); // spread requests out
    } catch (error) {
      log(`Image download failed (${url}): ${error.message}`);
    }
  }

  log(`Saved ${saved.length} image(s).`);
  return saved;
}

/** Writes one product folder (raw payload, Zava payload, page HTML). */
export async function persistProduct(runDir, product, zavaProduct, html) {
  const dir = path.join(runDir, 'products', slugify(product.name));
  await ensureDir(dir);
  const { html: _ignored, ...rawProduct } = product;
  await writeJson(path.join(dir, 'product.json'), rawProduct);
  await writeJson(path.join(dir, 'zava-product.json'), zavaProduct);
  if (html) await writeText(path.join(dir, 'page.html'), html);
  return dir;
}
