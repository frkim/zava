/**
 * Human-like interaction helpers.
 *
 * Everything in this module exists to make the browsing session look like a
 * person using a laptop: irregular pauses, mouse movements that follow a curve,
 * typing with variable key delays and progressive scrolling instead of jumps.
 */

const rand = (min, max) => min + Math.random() * (max - min);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Guards a promise with a hard deadline.
 *
 * `page.evaluate` and mouse actions are not covered by Playwright's default
 * timeouts, so a page stuck on a challenge or a pending navigation would hang
 * the whole run. Every risky call goes through this helper.
 */
export async function withTimeout(promise, ms, fallback = null) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

/** Pause for a random duration inside [min, max] milliseconds. */
export async function pause(min = 450, max = 1400) {
  await sleep(rand(min, max));
}

/** Longer "reading" pause, used after a page settles. */
export async function read(page, min = 1600, max = 4200) {
  const duration = rand(min, max);
  const started = Date.now();
  while (Date.now() - started < duration) {
    await microMove(page);
    await sleep(rand(180, 420));
  }
}

/** Tiny mouse drift, like a hand resting on a trackpad. */
async function microMove(page) {
  const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
  await withTimeout(
    page.mouse.move(rand(80, viewport.width - 80), rand(80, viewport.height - 120), {
      steps: Math.round(rand(3, 8)),
    }),
    3000,
  );
}

/**
 * Move the cursor to an element along a slightly curved path, then click it.
 * Returns false when the element never became visible.
 */
export async function humanClick(page, locator, { timeout = 12000 } = {}) {
  try {
    await locator.waitFor({ state: 'visible', timeout });
  } catch {
    return false;
  }

  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await pause(220, 650);

  const box = await locator.boundingBox();
  if (!box) return false;

  const target = {
    x: box.x + box.width * rand(0.32, 0.68),
    y: box.y + box.height * rand(0.34, 0.66),
  };

  // Approach in two hops so the trajectory is not a straight line.
  await withTimeout(
    page.mouse.move(target.x + rand(-90, 90), target.y + rand(-70, 70), {
      steps: Math.round(rand(8, 16)),
    }),
    5000,
  );
  await sleep(rand(60, 180));
  await withTimeout(page.mouse.move(target.x, target.y, { steps: Math.round(rand(10, 22)) }), 5000);
  await sleep(rand(90, 260));

  try {
    await withTimeout(page.mouse.down(), 5000);
    await sleep(rand(45, 130));
    await withTimeout(page.mouse.up(), 5000);
    return true;
  } catch {
    // Fall back to a programmatic click if the synthetic one was interrupted.
    return locator
      .click({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
  }
}

/** Type text one character at a time with irregular delays and occasional pauses. */
export async function humanType(page, locator, text) {
  await locator.click({ timeout: 10000 }).catch(() => {});
  await pause(200, 600);
  for (const char of text) {
    await withTimeout(page.keyboard.type(char, { delay: rand(55, 185) }), 5000);
    if (Math.random() < 0.07) await sleep(rand(180, 520)); // brief hesitation
  }
  await pause(350, 900);
}

/**
 * Scroll down the page in small increments, pausing as a reader would.
 * Stops early once the bottom is reached.
 */
export async function humanScroll(page, { steps = 6, min = 250, max = 620 } = {}) {
  for (let i = 0; i < steps; i += 1) {
    const delta = rand(min, max);
    await withTimeout(page.mouse.wheel(0, delta), 5000);
    await sleep(rand(320, 900));
    if (Math.random() < 0.18) {
      await withTimeout(page.mouse.wheel(0, -rand(60, 200)), 5000); // small scroll back
      await sleep(rand(250, 700));
    }
    const atBottom = await withTimeout(
      page.evaluate(() => window.innerHeight + window.scrollY >= document.body.scrollHeight - 80),
      5000,
      false,
    );
    if (atBottom) break;
  }
}

/** Scroll back to the top the way a user flicks upwards. */
export async function scrollToTop(page) {
  for (let i = 0; i < 6; i += 1) {
    await withTimeout(page.mouse.wheel(0, -rand(600, 1200)), 5000);
    await sleep(rand(120, 300));
  }
}
