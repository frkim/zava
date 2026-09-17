import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const screenshots = join(tmpdir(), 'zava-recipe-ui');
await mkdir(screenshots, { recursive: true });

const [target] = await (await fetch('http://127.0.0.1:5187/json/list')).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
  if (!message.id) return;
  const handler = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(JSON.stringify(message.error)));
  else handler.resolve(message.result);
});
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const wait = async (expression, label) => {
  for (let i = 0; i < 200; i++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout: ${label}\n${await evaluate('document.body.innerText')}`);
};
const text = string => `document.body.innerText.includes(${JSON.stringify(string)})`;
const click = label => evaluate(`(() => {
  const element = [...document.querySelectorAll('button,[role="button"]')].find(el => el.innerText.trim() === ${JSON.stringify(label)});
  if (!element) throw new Error('Missing button: ' + ${JSON.stringify(label)});
  element.click();
})()`);
const input = (selector, value) => evaluate(`(() => {
  const element = document.querySelector(${JSON.stringify(selector)});
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, ${JSON.stringify(value)});
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
const configure = settings => fetch('http://localhost:5185/__test', { method: 'POST', body: JSON.stringify(settings) });
const state = async () => (await fetch('http://localhost:5185/__test')).json();
const count = async path => (await state()).calls.filter(call => call.path.endsWith(path)).length;
const navigate = async (path = '/recipe-basket') => {
  await cdp('Page.navigate', { url: `http://localhost:5186${path}` });
};
const ready = async () => {
  await navigate();
  await wait("!!document.querySelector('#recipe-name')", 'recipe form');
};
const screenshot = async file => {
  const image = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile(join(screenshots, file), Buffer.from(image.data, 'base64'));
};
const prepare = async () => {
  await click('Lasagnes');
  await click('Préparer ma liste de courses');
  await wait(text('Votre liste à vérifier'), 'preview');
};
await cdp('Runtime.enable');
await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
await configure({ site: 'Grocery', available: true, optionFailures: 0, planFailures: 0, commitFailures: 0, planDelay: 800, expiryMs: 600000, empty: false });
await ready();
assert.equal(await evaluate("document.querySelector('#recipe-name').maxLength"), 200);
assert.equal(await evaluate("document.querySelector('#recipe-servings').value"), '4');
assert.equal(await evaluate("document.querySelector('input[name=\"recipe-brand-preference\"]:checked').value"), 'Mix');
for (const suggestion of ['Lasagnes', 'Blanquette de veau', 'Hachis parmentier', 'Bœuf bourguignon']) assert.equal(await evaluate(text(suggestion)), true);
assert.equal(await count('/commit'), 0);
await screenshot('.recipe-ui-desktop.png');
console.log('PASS initial defaults, suggestions, input limit and no cart mutation');

await click('Lasagnes');
await input('#recipe-servings', '6');
await evaluate("document.querySelector('input[value=\"PrivateLabel\"]').click()");
const beforePlan = await count('/plan');
await click('Préparer ma liste de courses');
await evaluate("document.querySelector('form button[type=\"submit\"]').click()");
await wait(text('La demande est en cours.'), 'factual progress');
assert.equal(await evaluate("document.querySelector('#recipe-name').disabled"), true);
await wait(text('Votre liste à vérifier'), 'preview');
assert.equal(await count('/plan'), beforePlan + 1);
const submitted = (await state()).calls.filter(call => call.path.endsWith('/plan')).at(-1).body;
assert.deepEqual(submitted, { recipe: 'Lasagnes', servings: 6, brandPreference: 'PrivateLabel' });
for (const value of ['Paquet de 500 g', '2 paquet(s) / unité(s)', '16,98', 'Noix de muscade', 'Points à vérifier', 'allergènes']) assert.equal(await evaluate(text(value)), true);
assert.equal(await count('/commit'), 0);
await screenshot('.recipe-ui-preview.png');
console.log('PASS real request payload, duplicate planning guard, honest progress, variants, pack quantities, missing ingredients and warnings');

await input('#recipe-name', 'Blanquette de veau');
await wait(`!(${text('Votre liste à vérifier')})`, 'stale preview cleared');
await input('#recipe-servings', '0');
assert.equal(await evaluate("document.querySelector('form button[type=\"submit\"]').disabled"), true);
await input('#recipe-servings', '21');
assert.equal(await evaluate("document.querySelector('form button[type=\"submit\"]').disabled"), true);
await input('#recipe-servings', '1.5');
assert.equal(await evaluate("document.querySelector('form button[type=\"submit\"]').disabled"), true);
await input('#recipe-servings', '20');
assert.equal(await evaluate("document.querySelector('form button[type=\"submit\"]').disabled"), false);
await input('#recipe-servings', '4');
await configure({ planFailures: 1 });
await click('Préparer ma liste de courses');
await wait(text('Réessayez la préparation dans un instant.'), 'plan failure');
await click('Réessayer');
await wait(text('Votre liste à vérifier'), 'retry preview');
console.log('PASS stale preview reset, servings 1–20 integer validation and plan error retry');

await configure({ commitFailures: 1 });
const beforeCommit = await count('/commit');
await click('Confirmer et ajouter les produits disponibles');
await evaluate("[...document.querySelectorAll('button')].find(el => el.innerText.includes('Ajout au panier')).click()");
await wait(text('Connexion interrompue pendant la confirmation.'), 'commit failure');
assert.equal(await count('/commit'), beforeCommit + 1);
await click('Réessayer le même ajout');
await wait(text('Les produits de votre recette ont été ajoutés au panier.'), 'commit success');
const commitCalls = (await state()).calls.filter(call => call.path.endsWith('/commit'));
assert.equal(commitCalls.at(-1).body.planId, commitCalls.at(-2).body.planId);
assert.equal((await state()).cart.items[0].variantId, 999);
assert.equal((await state()).cart.itemCount, 7);
assert.equal(await evaluate("document.querySelector('.MuiBadge-badge').innerText"), '7');
assert.equal(await evaluate("[...document.querySelectorAll('button')].find(el => el.innerText.trim() === 'Produits ajoutés').disabled"), true);
console.log('PASS explicit partial confirmation, duplicate commit guard, idempotent retry ID, preserved basket and immediate badge/success notification');

await configure({ expiryMs: 100 });
await ready();
await prepare();
await wait(text('Cette proposition a expiré.'), 'expired preview');
assert.equal(await evaluate("[...document.querySelectorAll('button')].find(el => el.innerText.startsWith('Confirmer')).disabled"), true);
await configure({ expiryMs: 600000 });
await click('Actualiser la proposition');
await wait(text('Votre liste à vérifier'), 'refreshed preview');
await wait(`!(${text('Cette proposition a expiré.')})`, 'cleared expiration');
console.log('PASS expiration blocks stale confirmation and regeneration restores preview');

await configure({ empty: true });
await ready();
await prepare();
assert.equal(await evaluate(text('Aucun produit n’a été trouvé.')), true);
assert.equal(await evaluate("[...document.querySelectorAll('button')].find(el => el.innerText.startsWith('Confirmer')).disabled"), true);
await configure({ empty: false, available: false });
await navigate();
await wait(text('L’assistant recette est indisponible'), 'unavailable service');
assert.equal(await evaluate("document.querySelector('#recipe-name') === null"), true);
assert.equal(await evaluate("!!document.querySelector('a[href=\"/cart\"]') && !!document.querySelector('a[href=\"/search\"]')"), true);
await configure({ available: true, optionFailures: 1 });
await navigate();
await wait(text('Impossible de vérifier la disponibilité'), 'options failure');
await click('Réessayer');
await wait("!!document.querySelector('#recipe-name')", 'options retry');
console.log('PASS empty results, unavailable AI keeps normal shopping accessible, options failure retry');

await configure({ site: 'Electronics' });
await navigate();
await wait(text('Le panier recette est réservé'), 'other site unavailable');
assert.equal(await evaluate("document.querySelector('#recipe-name') === null && document.querySelector('a[href=\"/recipe-basket\"]') === null"), true);
await navigate('/');
await wait(text('Bienvenue sur Zava'), 'non grocery home');
assert.equal(await evaluate("document.querySelector('a[href=\"/recipe-basket\"]') === null"), true);
await configure({ site: 'Grocery' });
await navigate('/');
await wait(text('Un plat en tête ?'), 'grocery homepage entry');
await navigate('/cart');
await wait(text('Un plat en tête ?'), 'grocery cart entry');
console.log('PASS Grocery-only route, header, home and cart discoverability');

await ready();
await evaluate("localStorage.setItem('zava-lang', 'en')");
await navigate();
await wait(text('What are we cooking?'), 'English translation');
for (const value of ['National brands', 'Store brands', 'Budget-friendly', 'A mix', 'allergens']) assert.equal(await evaluate(text(value)), true);
await evaluate("localStorage.setItem('zava-lang', 'fr')");
await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await ready();
await screenshot('.recipe-ui-mobile.png');
const width = await evaluate('({ viewport: window.innerWidth, page: document.documentElement.scrollWidth })');
console.log('MOBILE WIDTH', JSON.stringify(width));
assert.equal(width.page <= width.viewport, true, 'No horizontal page overflow at 390px');
assert.equal(await evaluate("document.querySelector('#recipe-name').labels[0].innerText.includes('Votre recette')"), true);
assert.equal(await evaluate("document.querySelector('[role=\"radiogroup\"]').getAttribute('aria-labelledby')"), 'recipe-brands');
await prepare();
await screenshot('.recipe-ui-mobile-preview.png');
const previewWidth = await evaluate('({ viewport: window.innerWidth, page: document.documentElement.scrollWidth })');
assert.equal(previewWidth.page <= previewWidth.viewport, true, 'No horizontal preview overflow');
assert.deepEqual(exceptions, []);
console.log('PASS English/French, labelled controls, mobile form/preview layout and no runtime exceptions');
console.log('All native Chromium mocked-API UI checks passed.');
socket.close();
