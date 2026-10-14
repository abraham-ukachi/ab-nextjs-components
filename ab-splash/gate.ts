/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.

*
* @project: ab-nextjs-components
* @name: AbSplash - Gate script & timing helpers
* @file: ab-splash/gate.ts
* @type: TypeScript (isomorphic, no Node or DOM imports)
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🚩 the `<html>` data attribute that turns the Splash on (set by the gate script, before the first paint ⚡️)
export const AB_SPLASH_ATTRIBUTE = 'data-ab-splash';
// 👣 the localStorage key that remembers the first ever visit
export const AB_SPLASH_VISITED_KEY = 'ab-splash-visited';
// 📱 the sessionStorage key that remembers the Splash was shown in this (standalone) session
export const AB_SPLASH_SESSION_KEY = 'ab-splash-session';
// ⏱️ the Splash never stays longer than this (in ms)
export const AB_SPLASH_MAX_MS = 1200;
// 🌫️ the fade-out duration (in ms), when motion is allowed
export const AB_SPLASH_FADE_MS = 200;
// 🤖 user agents that never get a Splash (crawlers, previews, headless tools)
export const AB_SPLASH_BOT_PATTERN = 'bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|discordbot|headlesschrome|lighthouse|pagespeed|prerender';

// ⚙️ gate options
export interface AbSplashGateOptions {
  // 🌍 every configured locale (e.g. ['en', 'fr', 'es', 'ru'])
  locales?: readonly string[];
  // 🏠 the default locale (served without a prefix, so `/en` is NOT a root page)
  defaultLocale?: string;
  // 🚪 extra "root" sub-paths that also show the Splash on first visit (default: ['welcome'])
  rootSubPaths?: readonly string[];
}

// 🛡️ escape a string for use inside a RegExp
const escapeRe = (value: string): string => value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

/**
 * 🧭 Build the root-path RegExp source from the configured locales minus the default.
 * e.g. locales en/fr/es/ru + default en → `^(?:\/(?:fr|es|ru))?(?:\/(?:welcome))?\/?$`
 */
export function buildAbSplashRootPathPattern(options: AbSplashGateOptions = {}): string {
  // 🌍 prefixed locales only (the default one has no prefix)
  const prefixed = (options.locales ?? []).filter((locale) => locale && locale !== options.defaultLocale).map(escapeRe);
  // 🚪 sub-paths (welcome by default)
  const subPaths = (options.rootSubPaths ?? ['welcome']).filter(Boolean).map(escapeRe);
  // 🧱 optional locale prefix
  const localePart = prefixed.length ? `(?:\\/(?:${prefixed.join('|')}))?` : '';
  // 🧱 optional sub-path
  const subPart = subPaths.length ? `(?:\\/(?:${subPaths.join('|')}))?` : '';
  // 🏁 anchored pattern (optional trailing slash)
  return `^${localePart}${subPart}\\/?$`;
}

/**
 * 🚦 Build the inline gate script (runs in <head>, before the first paint).
 * Inject with `<script dangerouslySetInnerHTML={{ __html: script }} />` and allow its hash in the CSP
 * (see `getAbSplashGateSha256` in `ab-nextjs-components/ab-splash/csp`).
 */
export function buildAbSplashGateScript(options: AbSplashGateOptions = {}): string {
  // 🧭 root-path pattern, injected as a JSON string literal (never raw-concatenated)
  const pattern = JSON.stringify(buildAbSplashRootPathPattern(options));
  // 🤖 bot pattern, also JSON-injected
  const bots = JSON.stringify(AB_SPLASH_BOT_PATTERN);
  // 🧾 the script (plain ES5, comments allowed: newlines are kept)
  return `(function () {
  // 🧭 shortcuts
  var w = window, d = document, nav = w.navigator || {};
  // 🤖 skip automation and bots (no Splash for crawlers, previews or headless tests)
  if (nav.webdriver || new RegExp(${bots}, 'i').test(nav.userAgent || '')) return;
  // 📖 safe storage read: a failing get counts as "already seen" ('1')
  function get(store, key) { try { return w[store].getItem(key); } catch (e) { return '1'; } }
  // ✍️ safe storage write: a failing set is ignored
  function set(store, key) { try { w[store].setItem(key, '1'); } catch (e) {} }
  // 📱 installed PWA? (matchMedia OR iOS navigator.standalone)
  var mm = false;
  try { mm = !!(w.matchMedia && w.matchMedia('(display-mode: standalone)').matches); } catch (e) {}
  var isStandalone = mm || nav.standalone === true;
  // 🏠 a root page? (/, /<locale>, /welcome, /<locale>/welcome — never the default locale prefix)
  var isRootPage = false;
  try { isRootPage = new RegExp(${pattern}).test(w.location.pathname); } catch (e) {}
  // 🚦 decision
  var show = false;
  // 📱 standalone: once per session
  if (isStandalone) {
    if (!get('sessionStorage', ${JSON.stringify(AB_SPLASH_SESSION_KEY)})) show = true;
    set('sessionStorage', ${JSON.stringify(AB_SPLASH_SESSION_KEY)});
  }
  // 👣 first ever visit, on a root page only
  if (!get('localStorage', ${JSON.stringify(AB_SPLASH_VISITED_KEY)})) {
    if (isRootPage) show = true;
    set('localStorage', ${JSON.stringify(AB_SPLASH_VISITED_KEY)});
  }
  // 🚩 last step: turn the Splash on
  if (show) { try { d.documentElement.setAttribute(${JSON.stringify(AB_SPLASH_ATTRIBUTE)}, 'on'); } catch (e) {} }
})();`;
}

// 🚦 the default gate script (no locale prefixes; build your own with `buildAbSplashGateScript`)
export const abSplashGateScript: string = buildAbSplashGateScript();

// ⏳ time left before the cap (never below 0, never above the max)
export function getAbSplashRemainingMs(elapsedMs: number, maxMs: number = AB_SPLASH_MAX_MS): number {
  return Math.min(maxMs, Math.max(0, maxMs - elapsedMs));
}

// 🌫️ fade duration (0 with reduced motion ♿)
export function getAbSplashFadeMs(prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? 0 : AB_SPLASH_FADE_MS;
}

// 🏁 resolve when fonts are ready or the timeout hits, whichever comes first
export function waitForAbSplashReady(fontsReady: Promise<unknown> | undefined, timeoutMs: number): Promise<'fonts' | 'timeout'> {
  // ⏱️ the timeout racer
  const timeout = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), timeoutMs));
  // 🤷 no Font Loading API → timeout only
  if (!fontsReady) return timeout;
  // 🔤 a failing font load counts as ready too
  const fonts = fontsReady.then(() => 'fonts' as const, () => 'fonts' as const);
  // 🏁 first one wins
  return Promise.race([fonts, timeout]);
}

// 🙈 minimal element shape used by the inert helper (keeps it testable without a DOM)
export interface AbInertNode {
  parentElement: AbInertNode | null;
  children: ArrayLike<AbInertNode>;
  inert?: boolean;
  tagName?: string;
}

/**
 * 🙈 Make everything behind `overlay` inert (siblings on the path up to <body>).
 * Returns a restore function that only un-inerts what it changed.
 */
export function setAbSplashBackgroundInert(overlay: AbInertNode): () => void {
  // 📝 nodes we changed
  const changed: AbInertNode[] = [];
  // ⬆️ walk up from the overlay to <body>
  let node: AbInertNode | null = overlay;
  while (node && node.parentElement) {
    // 👪 the parent
    const parent: AbInertNode = node.parentElement;
    // 🔁 every sibling of the current node
    for (const sibling of Array.from(parent.children)) {
      // ✅ skip the overlay's own branch, scripts/styles and already-inert nodes
      if (sibling === node || sibling.inert || /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(sibling.tagName ?? '')) continue;
      // 🙈 make it inert
      sibling.inert = true;
      // 📝 remember it
      changed.push(sibling);
    }
    // 🛑 stop at <body>
    if ((parent.tagName ?? '').toUpperCase() === 'BODY') break;
    // ⬆️ go up
    node = parent;
  }
  // ↩️ restore
  return () => { for (const el of changed) el.inert = false; };
}
