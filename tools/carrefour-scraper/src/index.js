#!/usr/bin/env node
/**
 * Carrefour product collector.
 *
 * Browses https://www.carrefour.fr/ in a real (visible) browser the way a person
 * would — search, scroll, click, read — and stores the product name, description,
 * features and pictures in the OS temp folder, ready to seed new Zava products.
 *
 * Usage:
 *   node src/index.js --search "nutella" --max 3
 *   node src/index.js --url https://www.carrefour.fr/p/...
 *   node src/index.js --search "café" --headless --max 5 --category-id 8
 */

import path from 'node:path';
import { launchSession } from './browser.js';
import { toZavaProduct } from './mapToZava.js';
import { pause, sleep } from './human.js';
import {
  downloadImages,
  openHomePage,
  persistProduct,
  scrapeProduct,
  searchProducts,
} from './scraper.js';
import { createRunDir, rootDir, writeJson } from './store.js';

function parseArgs(argv) {
  const options = {
    search: [],
    urls: [],
    max: 3,
    headless: false,
    saveHtml: false,
    images: 6,
    stock: 100,
    startId: 1,
    categoryId: undefined,
    channel: undefined,
    out: undefined,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case '--search':
      case '-s':
        options.search.push(next());
        break;
      case '--url':
      case '-u':
        options.urls.push(next());
        break;
      case '--max':
      case '-m':
        options.max = Number(next());
        break;
      case '--images':
        options.images = Number(next());
        break;
      case '--category-id':
        options.categoryId = Number(next());
        break;
      case '--start-id':
        options.startId = Number(next());
        break;
      case '--stock':
        options.stock = Number(next());
        break;
      case '--out':
        options.out = next();
        break;
      case '--channel':
        options.channel = next();
        break;
      case '--headless':
        options.headless = true;
        break;
      case '--save-html':
        options.saveHtml = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        options.search.push(arg);
    }
  }
  return options;
}

const HELP = `
Carrefour product collector — browses carrefour.fr like a human and stores products in the temp folder.

Options:
  -s, --search <query>     Search term (repeatable)
  -u, --url <url>          Scrape a product page directly (repeatable)
  -m, --max <n>            Max products per search term (default 3)
      --images <n>         Max images per product (default 6)
      --category-id <n>    Force the Zava category id instead of guessing
      --start-id <n>       First id assigned to the generated Zava products (default 1)
      --stock <n>          Stock value for the generated Zava products (default 100)
      --out <dir>          Override the storage root (default <temp>/zava-carrefour)
      --channel <name>     Browser channel: chrome | msedge | chromium
      --headless           Run without a visible window (less human-like)
      --save-html          Also save the raw product page HTML
  -h, --help               Show this help
`;

function createLogger() {
  const started = Date.now();
  return (message) => {
    const seconds = ((Date.now() - started) / 1000).toFixed(1).padStart(6, ' ');
    console.log(`[${seconds}s] ${message}`);
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || (!options.search.length && !options.urls.length)) {
    console.log(HELP);
    process.exit(options.help ? 0 : 1);
  }

  const log = createLogger();
  const runDir = await createRunDir(options.out);
  log(`Storage root: ${rootDir(options.out)}`);
  log(`Run folder:   ${runDir}`);

  const { context, channel, viewport } = await launchSession({
    headless: options.headless,
    channel: options.channel,
  });
  log(`Browser: ${channel} ${viewport.width}x${viewport.height} (${options.headless ? 'headless' : 'visible'})`);

  const page = context.pages()[0] ?? (await context.newPage());
  const collected = [];
  const failures = [];

  try {
    await openHomePage(page, log);

    const targets = [...options.urls];
    for (const query of options.search) {
      const found = await searchProducts(page, query, options.max, log);
      targets.push(...found);
      await pause(900, 2000);
    }

    const unique = [...new Set(targets)];
    log(`${unique.length} product page(s) to visit.`);

    let nextId = options.startId;
    for (const [index, url] of unique.entries()) {
      try {
        const product = await scrapeProduct(page, url, log, { saveHtml: options.saveHtml });
        if (!product.name) throw new Error('No product name found on the page');

        const zavaProduct = toZavaProduct(product, {
          id: nextId,
          categoryId: options.categoryId,
          stock: options.stock,
        });

        const dir = await persistProduct(runDir, product, zavaProduct, product.html);
        const images = await downloadImages(context, product, dir, log, options.images);
        await writeJson(path.join(dir, 'images', 'images.json'), images);

        collected.push({
          id: nextId,
          name: product.name,
          brand: product.brand,
          price: product.price,
          features: product.features.length,
          images: images.length,
          url,
          folder: dir,
          zavaProduct,
        });
        log(`✔ ${product.name} — ${product.features.length} feature(s), ${images.length} image(s)`);
        nextId += 1;
      } catch (error) {
        failures.push({ url, error: error.message });
        log(`✖ Failed on ${url}: ${error.message}`);
      }

      // Pause between products, as a shopper would before opening the next one.
      if (index < unique.length - 1) await sleep(2000 + Math.random() * 3500);
    }

    const summary = {
      runDir,
      startedAt: new Date().toISOString(),
      searches: options.search,
      directUrls: options.urls,
      browser: channel,
      products: collected.map(({ zavaProduct: _mapped, ...item }) => item),
      failures,
    };
    await writeJson(path.join(runDir, 'index.json'), summary);
    // Aggregate file that can be pasted into a *-products.json seeder file.
    await writeJson(
      path.join(runDir, 'zava-products.json'),
      collected.map((item) => item.zavaProduct),
    );

    log(`Done. ${collected.length} product(s) stored in ${runDir}`);
    if (failures.length) log(`${failures.length} page(s) failed — see index.json`);
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`\nFatal: ${error.message}`);
  process.exit(1);
});
