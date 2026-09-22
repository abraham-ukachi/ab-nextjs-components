# Changelog

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
