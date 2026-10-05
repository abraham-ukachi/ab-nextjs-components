## 0.1.7 — 2026-10-05

- **AbNavbar:** root `<nav>` sets `data-ab-part="bottomBar"` (client + server)

## 0.1.6 — 2026-10-05

- **AbSidebar:** renders `<nav data-ab-part="sidebar">` (was `<aside>`) so aside dialogs/menus never hit the sidebar
- **AbMenu:** sets `data-id={id}` (keeps `id`) and `data-id` / `menu-item` on items so `useAbMenu` can open it; cancel is `li[role=close-menu]`
- **AbLogo:** ships `ab-logo/ab-logo.svg` and defaults `src` to an inlined data URI of that asset; mask types without `src`/`mask` defer to `ab-nextjs-theme` `--app-logo-url`

## 0.1.5 — 2026-10-03

- Publish to npm automatically from GitHub Actions with Trusted Publishing (OIDC + provenance, no NPM_TOKEN)
- `next` peer is now `^16.3.4`; dev dependency on ab-nextjs-hooks comes from the registry

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
