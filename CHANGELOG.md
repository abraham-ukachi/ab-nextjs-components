## 0.1.9 — 2026-10-14

- **AbLogo:** `wordmark` prop (`true` → "Elements", or any string) renders a mark + Quicksand Bold lockup (`font-quicksand-bold` from ab-nextjs-fonts); `color` prop (`--ab-logo-color`); light / dark (`html.dark`)
- **AbLogo fix:** `naked` with no `src` now masks with the shipped Ab mark (via `--app-logo-url` fallback) instead of a bronze square when the chrome CSS isn't loaded
- **AbSplash (new, `ab-nextjs-components/ab-splash`):** brand overlay + `abSplashGateScript` / `buildAbSplashGateScript({ locales, defaultLocale })`; root-path RegExp built from locales minus the default and JSON-injected; skips `navigator.webdriver` / bot UAs; standalone via `matchMedia` OR `navigator.standalone`; each storage get/set in its own try (failed get = seen); `data-ab-splash` set last; page behind is `inert` while shown; track `min(18rem, 28vw)`
- **CSP:** `ab-nextjs-components/ab-splash/csp` → `getAbSplashGateSha256(script)`, `buildAbSplashGate(options)`, `AB_SPLASH_GATE_SHA256`
- **AbLinearProgress (new here, `ab-nextjs-components/ab-linear-progress`):** ported from the reviewed core work — determinate / indeterminate, `color`, reduced motion, dark, RTL sweep, empty `aria-label` dropped; shipped CSS module. AbSplash uses it, so **no `ab-nextjs-core` peer is needed**
- **CSP (P1):** `ab-nextjs-components/ab-splash/csp` now ships compiled `csp.mjs` + `csp.d.ts` (Node-loadable from `next.config.*`); `build:csp` script, `check:publish` / `prepublishOnly` fail when it's stale
- **AbSplash:** unmount removes `data-ab-splash` + `inert`; scroll lock gets the same 1.2 s CSS failsafe; surfaces `#FFF8F3` / `#1A1310` (mocks)
- **Tooling:** `esbuild ^0.28.2` is now an explicit devDependency (direct in `pnpm-lock.yaml`; frozen install verified)
- **AbSplash:** StrictMode-safe teardown (`scheduleAbSplashFinish` / `cancelAbSplashFinish`); overflow failsafe verified in Chromium + WebKit
- **Tooling:** `typecheck` script, `types/css.d.ts`, vitest automatic JSX, `scripts/build-demo.mjs`

## 0.1.8 — 2026-10-05

- **Chrome styles:** dialog, toast, logo (`span.app-logo`), spinner, and empty-state doodle CSS + SVG assets now ship here via `@import "ab-nextjs-components/styles.css"` (import after `ab-nextjs-theme/styles.css`)
- **AbLogo:** comments corrected — mask fallback `--app-logo-url` is owned by this package’s chrome CSS, not the theme

## 0.1.7 — 2026-10-05

- **AbNavbar:** root `<nav>` sets `data-ab-part="bottomBar"` (client + server)

## 0.1.6 — 2026-10-05

- **AbSidebar:** renders `<nav data-ab-part="sidebar">` (was `<aside>`) so aside dialogs/menus never hit the sidebar
- **AbMenu:** sets `data-id={id}` (keeps `id`) and `data-id` / `menu-item` on items so `useAbMenu` can open it; cancel is `li[role=close-menu]`
- **AbLogo:** ships `ab-logo/ab-logo.svg` and defaults `src` to an inlined data URI of that asset; mask types without `src`/`mask` defer to `ab-nextjs-theme` `--app-logo-url`

## 0.1.5 — 2026-10-03

- Publish to npm automatically from GitHub Actions with Trusted Publishing (OIDC + provenance, no NPM_TOKEN)
- `next` peer is now `^16.3.4`; dev dependency on ab-nextjs-hooks comes from the registry

### Unreleased (planned 0.1.10, Welcome v6, not bumped; needs ab-nextjs-hooks >= 0.1.6)

* **AbCarousel (G31):** new subpath `ab-nextjs-components/ab-carousel` (+ server-safe `ab-carousel/helpers`). Compound parts `AbCarousel`, `AbCarouselTrack`, `AbCarouselSlide`, `AbCarouselPrev`, `AbCarouselNext`, `AbCarouselDots`, `AbCarouselCounter` + `useAbCarousel()`. APG carousel semantics (`aria-roledescription` carousel/slide, "n of total" labels, polite live region, inactive slides `inert` + `aria-hidden` after hydration), RTL-aware ←/→ + Home/End scoped to the region, swipe via `useAbSwipe`, reduced motion via `useAbReducedMotion` + CSS, controlled / uncontrolled, i18n labels on every control, `AB_CAROUSEL_NOSCRIPT_CSS` for the no-JS stack
* **AbIconButton (G6):** `aria-label` + `title` now sit on the interactive element (never the wrapper span); new `label` prop (falls back to `title`); the `href` variant is named and no longer has `role="button"`; the ligature glyph is `aria-hidden`; disabled links leave the tab order; loading sets `aria-busy`
* Dev: `happy-dom` + `@testing-library/react` for DOM tests

### Unreleased (chore/upgrade-next-16 — Skip-override / Phase 5 components)

## 0.1.4 — 2026-09-23

- Release from `main` after merge of PR #1 (Next 16.3.4 + Phase 1–5 ports).


* **Port (client):** AbBrand, AbName, AbNavbar, AbSidebar, AbText, AbTestHello, AbKeyFeature, AbMainHeadline, AbPreview, AbProduct, AbProductItem, AbSwitchBack, AbDemoBox, AbDemoCode
* **Port (server):** AbBrand, AbName, AbNavbar, AbSidebar, AbNavLink, AbText, AbTestHello, AbKeyFeature, AbSwitchBack
* Select/MenuItem skipped — empty on Projects (GitHub-only historically)
* Product/Preview adapted (Dexie/providers/i18n stripped); usable props API kept
* Catalog **51 Done** (36 client / 15 server). Local only — no push.

# Changelog

### Unreleased (chore/upgrade-next-16 — Phase 4 Port)

* **Port:** AbSearchbar, AbSearchResult, AbPagePaginator, AbPageSwitcher, AbProgressChips, AbPrice, AbPriceTag
* **Adapt:** AbImage (Dexie / offline / background-removal stripped; next/image + optional fallback)
* **Port (server):** AbPolygon
* Catalog 28 Done (22 client / 6 server). Plain CSS modules. Local only — no push.

### Unreleased (chore/upgrade-next-16 — Phase 2 Adapt + Phase 3 Port)

* **Adapt:** **AbBalloon** (`title=` locked) — Input now uses real AbBalloon
* **Port:** AbAvatar (client + server), AbBadge (server), AbTab, AbTabs, AbMenu, AbCollapsible, AbColor, AbInfo, AbLikeButton
* Plain CSS modules; LYD brand/nav/i18n stripped; Select/MenuItem skipped (not on Projects)

### Unreleased (chore/upgrade-next-16 — Phase 2)

* Ported **AbIcon** (client + server) — Material Symbols ligatures
* Ported **AbLogo** (client + server) — contained | outlined | hollow | naked; defaults from `ab-nextjs-icons` logos (`#a67c52`), optional `src` / `mask`
* Ported **AbButton** client from lyd-button; invented server (href → `<a>`, else submit/button; no onClick)
* Added minimal **AbIconButton** (Input dependency)
* Ported **AbInput** client — `useAbToggle` from `ab-nextjs-hooks/helpers/useAbToggle`; Balloon stub via `title=`; no console.logs
* Hard peers: next 16.3.4, react^19, clsx; soft optional peers: theme / icons / hooks / animations
* Plain CSS modules (no `@apply`); theme `data-*` attrs preserved on buttons

### Unreleased (Phase 1)

* Next.js **16.3.4** / React 19 tooling scaffold + Pending catalog

### 0.1.2

* Stub package version bump
