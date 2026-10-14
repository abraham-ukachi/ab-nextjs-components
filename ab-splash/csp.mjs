/*
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
* (MIT license text: see LICENSE)
*
* @project: ab-nextjs-components
* @name: AbSplash - CSP hash helpers (COMPILED, do not edit — run `node scripts/build-csp.mjs`)
* @file: ab-splash/csp.mjs
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/
// 🤖 generated from ab-splash/csp.ts + ab-splash/gate.ts (bundled, ESM, Node)

// ab-splash/csp.ts
import { createHash } from "node:crypto";

// ab-splash/gate.ts
var AB_SPLASH_ATTRIBUTE = "data-ab-splash";
var AB_SPLASH_VISITED_KEY = "ab-splash-visited";
var AB_SPLASH_SESSION_KEY = "ab-splash-session";
var AB_SPLASH_BOT_PATTERN = "bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|discordbot|headlesschrome|lighthouse|pagespeed|prerender";
var escapeRe = (value) => value.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
function buildAbSplashRootPathPattern(options = {}) {
  const prefixed = (options.locales ?? []).filter((locale) => locale && locale !== options.defaultLocale).map(escapeRe);
  const subPaths = (options.rootSubPaths ?? ["welcome"]).filter(Boolean).map(escapeRe);
  const localePart = prefixed.length ? `(?:\\/(?:${prefixed.join("|")}))?` : "";
  const subPart = subPaths.length ? `(?:\\/(?:${subPaths.join("|")}))?` : "";
  return `^${localePart}${subPart}\\/?$`;
}
function buildAbSplashGateScript(options = {}) {
  const pattern = JSON.stringify(buildAbSplashRootPathPattern(options));
  const bots = JSON.stringify(AB_SPLASH_BOT_PATTERN);
  return `(function () {
  // \u{1F9ED} shortcuts
  var w = window, d = document, nav = w.navigator || {};
  // \u{1F916} skip automation and bots (no Splash for crawlers, previews or headless tests)
  if (nav.webdriver || new RegExp(${bots}, 'i').test(nav.userAgent || '')) return;
  // \u{1F4D6} safe storage read: a failing get counts as "already seen" ('1')
  function get(store, key) { try { return w[store].getItem(key); } catch (e) { return '1'; } }
  // \u270D\uFE0F safe storage write: a failing set is ignored
  function set(store, key) { try { w[store].setItem(key, '1'); } catch (e) {} }
  // \u{1F4F1} installed PWA? (matchMedia OR iOS navigator.standalone)
  var mm = false;
  try { mm = !!(w.matchMedia && w.matchMedia('(display-mode: standalone)').matches); } catch (e) {}
  var isStandalone = mm || nav.standalone === true;
  // \u{1F3E0} a root page? (/, /<locale>, /welcome, /<locale>/welcome \u2014 never the default locale prefix)
  var isRootPage = false;
  try { isRootPage = new RegExp(${pattern}).test(w.location.pathname); } catch (e) {}
  // \u{1F6A6} decision
  var show = false;
  // \u{1F4F1} standalone: once per session
  if (isStandalone) {
    if (!get('sessionStorage', ${JSON.stringify(AB_SPLASH_SESSION_KEY)})) show = true;
    set('sessionStorage', ${JSON.stringify(AB_SPLASH_SESSION_KEY)});
  }
  // \u{1F463} first ever visit, on a root page only
  if (!get('localStorage', ${JSON.stringify(AB_SPLASH_VISITED_KEY)})) {
    if (isRootPage) show = true;
    set('localStorage', ${JSON.stringify(AB_SPLASH_VISITED_KEY)});
  }
  // \u{1F6A9} last step: turn the Splash on
  if (show) { try { d.documentElement.setAttribute(${JSON.stringify(AB_SPLASH_ATTRIBUTE)}, 'on'); } catch (e) {} }
})();`;
}
var abSplashGateScript = buildAbSplashGateScript();

// ab-splash/csp.ts
function getAbSplashGateSha256(script) {
  return `'sha256-${createHash("sha256").update(script, "utf8").digest("base64")}'`;
}
function buildAbSplashGate(options = {}) {
  const script = buildAbSplashGateScript(options);
  return { script, sha256: getAbSplashGateSha256(script) };
}
var AB_SPLASH_GATE_SHA256 = getAbSplashGateSha256(abSplashGateScript);
export {
  AB_SPLASH_GATE_SHA256,
  buildAbSplashGate,
  getAbSplashGateSha256
};
