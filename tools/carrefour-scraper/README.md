# Carrefour product collector

Small Node.js app that browses [carrefour.fr](https://www.carrefour.fr/) **like a human** and
collects, for each product: **name, description, features, price and pictures**.
Everything is written to the **OS temp folder** — nothing is committed to the repo — so the
captured data can be reviewed before being used to create new Zava products.

## Why it looks human

The app drives a real Chrome/Chromium window (not headless by default, no HTTP client):

| Behaviour | Implementation |
| --- | --- |
| Real browser, real profile | Persistent Chromium profile in the temp folder, so cookies and the cookie-banner choice survive between runs |
| Real identity | `fr-FR` locale, `Europe/Paris` timezone, desktop Chrome UA, randomised viewport |
| Navigation, not URL hacking | Home page → cookie banner → search box → result list → product tile |
| Typing | Character by character with 55–185 ms jitter and occasional hesitations |
| Mouse | Curved two-hop approach to each target, then a press/release with a realistic hold time |
| Reading | Random dwell time with small cursor drift after each page load |
| Scrolling | Incremental wheel steps, with occasional scroll-backs, never a jump to the bottom |
| Pacing | 2–5.5 s between two product pages, 300–1000 ms between image downloads |

Images are downloaded through the browser context, so they carry the same cookies and
`Referer` as the browsing session.

## Install

```powershell
cd tools/carrefour-scraper
npm install
npm run browsers   # one-time Chromium download (skip if you use --channel chrome)
```

## Usage

```powershell
# Search and collect the first 3 matches
node src/index.js --search "nutella" --max 3

# Several searches in one session
node src/index.js --search "café en grain" --search "huile d'olive" --max 2

# A specific product page
node src/index.js --url "https://www.carrefour.fr/p/pate-a-tartiner-nutella-3017620425035"

# Force the target Zava category and the first generated id
node src/index.js --search "jus d'orange" --category-id 8 --start-id 200
```

### Options

| Option | Default | Description |
| --- | --- | --- |
| `-s, --search <query>` | — | Search term, repeatable |
| `-u, --url <url>` | — | Product page to scrape directly, repeatable |
| `-m, --max <n>` | `3` | Max products per search term |
| `--images <n>` | `6` | Max pictures downloaded per product |
| `--category-id <n>` | guessed | Force the Zava category id |
| `--start-id <n>` | `1` | First id given to the generated Zava products |
| `--stock <n>` | `100` | Stock value for the generated products |
| `--out <dir>` | `<temp>/zava-carrefour` | Override the storage root |
| `--channel <name>` | auto | `chrome`, `msedge` or `chromium` |
| `--headless` | off | Run without a window (faster, less human-like) |
| `--save-html` | off | Also save the raw product page HTML |

## Output layout

```
%TEMP%/zava-carrefour/
  profile/                          persistent browser profile
  runs/<timestamp>/
    index.json                      run summary (products, failures)
    zava-products.json              all products, ready to paste into a seeder file
    products/<slug>/
      product.json                  raw capture: name, description, features,
                                    nutrition, images, price, EAN, breadcrumbs…
      zava-product.json             the same product in the Zava seeder shape
      images/01-<slug>.jpg …        downloaded pictures
      images/images.json            image url → local file mapping
      page.html                     raw page (only with --save-html)
```

`product.json` keeps everything that was found, including the feature list
(`[{ label, value }]`) built from the characteristics table, the definition lists
and the description bullets.

## Using the result to create Zava products

`zava-product.json` already matches the shape of
`src/Zava.Api/Services/Seeders/Data/*-products.json`:

1. Run the collector for the products you want.
2. Review `runs/<timestamp>/zava-products.json` — **translate `nameEn` / `descriptionEn`**,
   which are pre-filled with the French text.
3. Renumber `id` so it continues the target seeder file, then append the entries.
4. Copy the pictures to `src/Zava.Api/wwwroot/images/products/<SiteType>/<ProductId>/`,
   following the `main` / `medium` / `thumb` convention used by `scripts/download-images.ps1`.

The category id is guessed from the Carrefour breadcrumb trail using the grocery categories
declared in `GrocerySeeder.GenerateCategories()`; override it with `--category-id` when needed.

## Tests

```powershell
npm test
```

The tests serve two Carrefour-like pages from a local HTTP server: a schema.org-rich page and
a replica of the current grocery layout (price split across nodes, `infos-accordion` sections,
div-based nutrition grid, multi-size media URLs). They assert the extraction (name, description,
features, nutrition, images, EAN, breadcrumbs), the search-link collection and the Zava mapping —
no request is made to carrefour.fr.

## What is extracted, and from where

| Field | Source |
| --- | --- |
| name, brand, EAN, rating | JSON-LD `Product`, `<h1>` fallback |
| price | JSON-LD offer, else `.product-price__amount--main` (the amount is split across nodes, so `"3 ,49 €"` is normalised before parsing) |
| description | JSON-LD description when it is substantial, else the `Nom légal` / description accordion, else the meta description with the store SEO copy stripped |
| features | `.infos-accordion__section` panels (opened first), characteristic tables, `<dl>`, JSON-LD `additionalProperty` |
| nutrition | `.nutritional-details__table-row` cells |
| images | JSON-LD + gallery `<img>`, restricted to Carrefour hosts, deduplicated per media id keeping the largest size variant |
| categoryId | breadcrumb trail, accent-insensitive, aisle crumbs weighted above shelf crumbs |

## Notes

- Respect Carrefour's terms of use; keep the volume low and the pacing slow (the defaults
  already do). This tool is meant for occasional demo-content preparation, not bulk harvesting.
- Prices and availability are captured at a point in time and are not refreshed.
- If a run finds no product link, the page layout has probably changed: run without
  `--headless` to watch the session and adjust the selectors in `src/scraper.js`.
