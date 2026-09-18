/**
 * Temp-folder storage layout.
 *
 * Everything the scraper produces lives under the OS temp directory:
 *
 *   <temp>/zava-c4/
 *     profile/                       persistent browser profile (cookies, consent)
 *     runs/<run-id>/
 *       index.json                   summary of the run
 *       products/<slug>/
 *         product.json               raw scraped product (name, description, features…)
 *         zava-product.json          same product mapped to the Zava Product model
 *         images/<n>-<name>.jpg      downloaded pictures
 *         page.html                  saved product page (optional, --save-html)
 */

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const ROOT_NAME = 'zava-c4';

/** Root of all scraper artifacts inside the OS temp folder. */
export function rootDir(customRoot) {
  return customRoot ? path.resolve(customRoot) : path.join(os.tmpdir(), ROOT_NAME);
}

/** Persistent browser profile directory (shared across runs). */
export function profileDir(customRoot) {
  return path.join(rootDir(customRoot), 'profile');
}

/** Creates a timestamped run directory and returns its path. */
export async function createRunDir(customRoot) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.join(rootDir(customRoot), 'runs', stamp);
  await fs.mkdir(path.join(dir, 'products'), { recursive: true });
  return dir;
}

/** URL/file-safe slug used as the product folder name. */
export function slugify(value, fallback = 'produit') {
  const slug = String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  return slug || fallback;
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return file;
}

export async function writeText(file, content) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, content, 'utf8');
  return file;
}

export async function writeBinary(file, buffer) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, buffer);
  return file;
}
