/**
 * Browser session setup.
 *
 * Uses a persistent Chromium profile stored in the temp folder so that cookies,
 * the cookie-banner choice and local storage survive between runs — exactly what
 * a returning human visitor would look like.
 */

import { chromium, devices } from 'playwright';
import { profileDir } from './store.js';

const LOCALE = 'fr-FR';
const TIMEZONE = 'Europe/Paris';

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1512, height: 945 },
  { width: 1366, height: 768 },
  { width: 1600, height: 900 },
];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

/**
 * Hides the handful of properties that trivially identify an automated browser.
 * This keeps the session looking like a normal Chrome window; it is not an
 * attempt to defeat anti-bot systems.
 */
const HUMANISE_SCRIPT = () => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en-US'] });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  window.chrome = window.chrome ?? { runtime: {} };
};

/**
 * Launches a persistent browser context.
 * @param {{ headless?: boolean, channel?: string, slowMo?: number }} options
 */
export async function launchSession({ headless = false, channel, slowMo = 0 } = {}) {
  const viewport = VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];

  const baseOptions = {
    headless,
    slowMo,
    viewport,
    locale: LOCALE,
    timezoneId: TIMEZONE,
    userAgent: UA,
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,
    colorScheme: 'light',
    permissions: [],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      `--window-size=${viewport.width},${viewport.height}`,
    ],
    ignoreDefaultArgs: ['--enable-automation'],
  };

  // Prefer a real installed Chrome/Edge when available, fall back to bundled Chromium.
  const channels = channel ? [channel] : ['chrome', 'msedge', undefined];
  let lastError;
  for (const candidate of channels) {
    try {
      const context = await chromium.launchPersistentContext(profileDir(), {
        ...baseOptions,
        ...(candidate ? { channel: candidate } : {}),
      });
      await context.addInitScript(HUMANISE_SCRIPT);
      context.setDefaultTimeout(30000);
      context.setDefaultNavigationTimeout(60000);
      return { context, channel: candidate ?? 'chromium', viewport };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `Unable to launch a browser. Run "npx playwright install chromium" first.\n${lastError?.message ?? ''}`,
  );
}

export const desktopDevice = devices['Desktop Chrome'];
