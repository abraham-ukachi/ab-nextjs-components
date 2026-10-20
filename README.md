<p align="center">
  <!-- Ab - Logo - Light Mode --> 
  <a href="https://abraham-ukachi.vercel.app/#gh-light-mode-only" target="_blank">
    <img src="./.github/ab-logo-light.svg" alt="Ab Logo on Light" width="64" height="64" />
  </a>

  <!-- Ab - Logo - Dark Mode --> 
  <a href="https://abraham-ukachi.vercel.app/#gh-dark-mode-only" target="_blank">
    <img src="./.github/ab-logo-dark.svg" alt="Ab Logo on Dark" width="64" height="64" />
  </a>

  <!-- Next.js - Logo Name - Light Mode -->
  <a href="https://nextjs.org/#gh-light-mode-only" target="_blank">
    <img src="./.github/nextjs-logoname-light.svg" alt="Next.js LogoName on Light" width="192" height="64" />
  </a>

  <!-- Next.js - Logo Name - Dark Mode -->
  <a href="https://nextjs.org/#gh-dark-mode-only" target="_blank">
    <img src="./.github/nextjs-logoname-dark.svg" alt="Next.js LogoName on Dark" width="192" height="64" />
  </a>

</p>


<p align="center">
    <a href="https://ab-elements.vercel.app" target="_blank"><b>Checkout abElements &rarr;</b></a>
</p>


# `ab-nextjs-components`

> IMPORTANT: This is a work in progress and subject to major changes until version 1.0.


🚀 This is a lightweight collection of server & client React components created by [Abraham Ukachi](https://github.com/abraham-ukachi), and optimized for [Next.js](https://nextjs.org/docs) applications 😎.





### Component chrome styles

Dialog, toast, logo (`span.app-logo`), spinner, and empty-state doodle CSS (plus their SVG assets) live in this package:

```css
@import "ab-nextjs-theme/styles.css"; /* tokens */
@import "ab-nextjs-components/styles.css"; /* chrome */
```

Shipped assets: `assets/logos/ab-logo.svg`, `assets/spinners/3-dots-scale.svg`, `assets/spinners/12-dots-scale-rotate.svg`.


## Tooling (Phase 1)

- Next.js **16.3.4** / React **19** hard peers
- ESLint 9 flat + Vitest
- Package ships as TypeScript (`type: module`) with a `supportedComponents` catalog
- Phase 2 Adapt complete; Phase 4 + Skip-override (Phase 5 components) complete (local)



### Sidebar, menu & logo (0.1.6)

* `<AbSidebar>` is a **`<nav data-ab-part="sidebar">`** (not `<aside>`). Pair with `ab-nextjs-core@^0.1.4` + `ab-nextjs-hooks@^0.1.4` so aside dialogs target `aside.AbAsideLayout`.
* `<AbMenu id>` also sets **`data-id`**, so `useAbMenu` can find it.
* `<AbLogo>` defaults to the Ab logo **shipped in this package** (data URI / `ab-logo/ab-logo.svg`). Pass `src` to override.


### Buttons & install snippet (0.1.12)

* `<AbButton type="filled">` 🥉 is a solid bronze button (`--md-sys-color-primary` background, `--md-sys-color-on-primary` label and icon). It sets `data-type="filled"`, which **`ab-nextjs-theme@^0.3.3`** styles with hover, focus and disabled states. On older themes a built-in fallback still paints the solid bronze rest state.
  ```tsx
  <AbButton type="filled" label="Get started" />
  ```
* `<AbInstallSnippet>` tabs are **≥ 4.5:1** (WCAG AA) in light and dark, active, inactive and hover: inactive = on-surface-variant on surface-container, hover = on-surface on an 8% state layer, active = on-primary-container on primary-container.

### Docs shell (0.1.13) 🧭

New subpaths for the docs / PWA shell. All links go through **`AbLinkProvider`**, and every icon is an AbIcon (no Material Symbols font).

* **`ab-nextjs-components/ab-link`**: `<AbLinkProvider component={Link}>` swaps the link used by **every** Ab component (for example the locale-aware `Link` from `ab-nextjs-i18n`). `useAbLink()` and `<AbLink>` are exported too. It is the package's only `next/link` import (test-guarded).
  ```tsx
  <AbLinkProvider component={Link}>{children}</AbLinkProvider>
  ```
* **`<AbSidebar>` v2 (G40)**: `sections=[{ id, label, items: [{ href, icon, label, badge?, items? }] }]`, `activeHref`, `collapsed` / `defaultCollapsed` / `onCollapsedChange`, `header`, `labels`. The active item gets `aria-current="page"` and a filled icon. Collapsed it becomes a 72px rail with balloon tooltips. The collapse button has `aria-expanded` + `aria-controls` and is hidden when JS is off. The server twin renders the same markup (no toggle). Legacy `links` / `page` still work.
* **`<AbNavbar>` v2 (G41)**: `items` of `{ kind: 'link', href, icon, label }` or `{ kind: 'button', id, icon, label, onSelect, expanded?, controls? }`, filled active icon, `aria-current`, safe-area padding.
* **`<AbAppBar>` (G43)**: `brand`, `search`, `nav=[{ href, label }]`, `activeHref`, `actions`, `leading`, sticky with the theme hairline. Below **1180px** the nav moves into a "More" `AbMenu` (G26). It closes on Escape and outside click. With JS off the nav stays inline.
* **`<AbSearchTrigger>` + `<AbKbd>` (G44)**: shows ⌘K on Apple and Ctrl K elsewhere, sets `aria-keyshortcuts="Meta+K Control+K"`, calls `onOpen` (button) or falls back to `href` (link). `comingSoon` makes it `aria-disabled`.
* **`<AbCard>` / `<AbPackageCard>` (G45)**: one link per card (the title, stretched over the card). Hover lifts 2px on laptop and up only, never under `prefers-reduced-motion`.
* **`<AbToc>` (G46)**: plain `#id` links, `aria-current="location"`. Pair with `useAbScrollSpy` / `scrollToAbSection` from `ab-nextjs-hooks@0.1.7`.
* **`<AbBalloon>`** is now a real tooltip: `role="tooltip"`, `aria-describedby` on the trigger, shows on focus, after 300ms on hover, and hides on Escape.
* **JS off**: `<AbInstallSnippet>` shows the pnpm command and hides copy. `<AbLocaleSwitcher getHref>` falls back to a `<details>` list of `hreflang` links.
* ⚠️ **AbIcon has no font fallback any more.** An unknown name renders an empty box and warns once in development. The client AbIcon only knows registered icons, so register the ones your sidebar / navbar use:
  ```ts
  import code from 'ab-nextjs-icons/ab-icons/icons/code'
  registerAbIcons({ code })
  ```

### Home fidelity (0.1.14, unreleased) 🏠

These match the approved Home mocks (`home-fidelity-spec.md` §4/§5). Colours come from the `ab-nextjs-theme` ≥ 0.3.5 Home tokens, with the light mock values as fallbacks. Each component also has its own `--ab-list-*` / `--ab-crumbs-*` / `--ab-version-*` / `--ab-bottom-drawer-*` knobs.

* **`<AbList>` / `<AbListItem>`** (server-safe): `title`, `meta` (a `<code>` inside renders as mono), `media` (shown in a 30px tile), `badge` + `badgeTone="primary" | "tonal"` (64×22), `trailing="chevron"` or a node, and `href` (the whole row becomes a link).
* **`<AbBreadcrumbs items={[{ label, href? }]}>`** (server-safe): a `nav` > `ol`. The last crumb has `aria-current="page"`.
* **`<AbVersionSwitcher label="Docs" version="v0.2.x" versions={[{ value, href? }]} onSelect>`**: a 28px bordered trigger that opens an AbMenu. With JS off it falls back to a `<details>` list of links.
* **`<AbBottomDrawer>`**: an app-scope bottom `AbDrawer` with a 20px top radius, a grab handle and safe-area padding, centred at up to 560px from 768px. `<AbDrawerList as={AbBottomDrawer}>` uses it, and so does the mobile language picker.

### Drawers (0.1.14, unreleased) 🗄️

A drawer belongs to a **region**: the whole app, the main pane or the aside pane. It slides in from that region's edge, is clipped by it, and **never scrolls the document**.

> 🧱 **Requires `ab-nextjs-core` 0.1.6 or later markup** for the scopes (`.AbAppLayout`, `[data-ab-part="main"]`, `[data-ab-part="aside"]`). With older core, or with no layout, every drawer falls back to a viewport layer on `<body>`.

* **`<AbDrawer>`** (`ab-nextjs-components/ab-drawer`): `open`, `onClose`, `scope="app" | "main" | "aside"` (default `app`), `side="bottom" | "top" | "left" | "right" | "start" | "end"` (default `bottom`; `start` / `end` follow `dir`), `title` (or `aria-labelledby` / `aria-label`), `footer`, `size` (`--ab-drawer-size`), `modal` (default `true`), `closeLabel`, `noJsFallback` (default `true`).
  * It portals into a layer inside the core layout box (`.AbAppLayout`, `[data-ab-part="main"]`, `[data-ab-part="aside"]`). Without a layout it covers the viewport from `<body>`.
  * `role="dialog"`, `aria-modal`, and the label goes on the panel. Focus moves in and is trapped. Escape, a scrim click or the ✕ close it, and focus goes back to the opener. While it's open the rest of its scope is `inert`.
  * It slides for 240ms, the same as the panes, using `ab-nextjs-animations` motion. With reduced motion it appears without the slide.
  * Without JS (D41) the content renders in flow as a labelled `<section>`, so nothing is hidden behind JavaScript.
* **`useAbDrawer(scope?)`** (also on the root barrel) returns `{ open, show, close, toggle, setOpen, id, triggerProps, drawerProps }`:
  ```tsx
  import { AbDrawerList, useAbDrawer } from 'ab-nextjs-components'
  const d = useAbDrawer('app')
  <button {...d.triggerProps}>Language</button>
  <AbDrawerList {...d.drawerProps} side="bottom" title="Language" items={[{ value: 'en', label: 'English', lang: 'en' }]} value={locale} onSelect={setLocale} />
  ```
* **Presets.** `<AbDrawerList>` is one selectable list: `items={[{ value, label, description?, icon?, href?, lang?, disabled? }]}`, `value`, `onSelect`, `closeOnSelect`, with the current item marked `aria-current`. `<AbConfirmDrawer>` takes `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`, `tone="danger"` and `busy`. Escape, the scrim and ✕ count as cancel.
* **G56:** `<AbLocaleSwitcher presentation="drawer" | "auto">` and `<AbAppBar presentation="drawer" | "auto">` (the More menu) open as an app-scope bottom `AbDrawerList`. `auto` opens a drawer below 768px and a menu above. The default stays `menu`.

## Getting Started

### Installation

#### npm

```bash
npm i ab-nextjs-components
```

#### pnpm

```bash
pnpm install ab-nextjs-components
```

---

### Types

All the types are located in the `types` folder. A specific type like *`AbButtonProps`* can be imported directly:

```ts
import type { AbButtonProps } from 'ab-nextjs-components';
```



## Client Components

A list of all the **client components** and their current status:

| No. | Name | File | Status |
|:----|:-----|:-----|:-------|
| 1 | *`AbIcon`* | **ab-icon/index.tsx** | Done |
| 2 | *`AbLogo`* | **ab-logo/index.tsx** | Done |
| 3 | *`AbButton`* | **ab-button/index.tsx** | Done |
| 4 | *`AbIconButton`* | **ab-icon-button/index.tsx** | Done |
| 5 | *`AbInput`* | **ab-input/index.tsx** | Done |
| 6 | *`AbBalloon`* | **ab-balloon/index.tsx** | Done |
| 7 | *`AbAvatar`* | **ab-avatar/index.tsx** | Done |
| 8 | *`AbTab`* | **ab-tab/index.tsx** | Done |
| 9 | *`AbTabs`* | **ab-tabs/index.tsx** | Done |
| 10 | *`AbMenu`* | **ab-menu/index.tsx** | Done |
| 11 | *`AbCollapsible`* | **ab-collapsible/index.tsx** | Done |
| 12 | *`AbColor`* | **ab-color/index.tsx** | Done |
| 13 | *`AbInfo`* | **ab-info/index.tsx** | Done |
| 14 | *`AbLikeButton`* | **ab-like-button/index.tsx** | Done |
| 15 | *`AbSearchbar`* | **ab-searchbar/index.tsx** | Done |
| 16 | *`AbSearchResult`* | **ab-search-result/index.tsx** | Done |
| 17 | *`AbPagePaginator`* | **ab-page-paginator/index.tsx** | Done |
| 18 | *`AbPageSwitcher`* | **ab-page-switcher/index.tsx** | Done |
| 19 | *`AbProgressChips`* | **ab-progress-chips/index.tsx** | Done |
| 20 | *`AbPrice`* | **ab-price/index.tsx** | Done |
| 21 | *`AbPriceTag`* | **ab-price-tag/index.tsx** | Done |
| 22 | *`AbImage`* | **ab-image/index.tsx** | Done |
| 23 | *`AbBrand`* | **ab-brand/index.tsx** | Done |
| 24 | *`AbName`* | **ab-name/index.tsx** | Done |
| 25 | *`AbNavbar`* | **ab-navbar/index.tsx** | Done |
| 26 | *`AbSidebar`* | **ab-sidebar/index.tsx** | Done |
| 27 | *`AbText`* | **ab-text/index.tsx** | Done |
| 28 | *`AbTestHello`* | **ab-test-hello/index.tsx** | Done |
| 29 | *`AbKeyFeature`* | **ab-key-feature/index.tsx** | Done |
| 30 | *`AbMainHeadline`* | **ab-main-headline/index.tsx** | Done |
| 31 | *`AbPreview`* | **ab-preview/index.tsx** | Done |
| 32 | *`AbProduct`* | **ab-product/index.tsx** | Done |
| 33 | *`AbProductItem`* | **ab-product-item/index.tsx** | Done |
| 34 | *`AbSwitchBack`* | **ab-switch-back/index.tsx** | Done |
| 35 | *`AbDemoBox`* | **ab-demo-box/index.tsx** | Done |
| 36 | *`AbDemoCode`* | **ab-demo-code/index.tsx** | Done |

## Server Components

A list of all the **server components** and their current status:

| No. | Name | File | Status |
|:----|:-----|:-----|:-------|
| 1 | *`AbIcon`* | **server/ab-icon/index.tsx** | Done |
| 2 | *`AbLogo`* | **server/ab-logo/index.tsx** | Done |
| 3 | *`AbButton`* | **server/ab-button/index.tsx** | Done |
| 4 | *`AbAvatar`* | **server/ab-avatar/index.tsx** | Done |
| 5 | *`AbBadge`* | **server/ab-badge/index.tsx** | Done |
| 6 | *`AbPolygon`* | **server/ab-polygon/index.tsx** | Done |
| 7 | *`AbBrand`* | **server/ab-brand/index.tsx** | Done |
| 8 | *`AbName`* | **server/ab-name/index.tsx** | Done |
| 9 | *`AbNavbar`* | **server/ab-navbar/index.tsx** | Done |
| 10 | *`AbSidebar`* | **server/ab-sidebar/index.tsx** | Done |
| 11 | *`AbNavLink`* | **server/ab-nav-link/index.tsx** | Done |
| 12 | *`AbText`* | **server/ab-text/index.tsx** | Done |
| 13 | *`AbTestHello`* | **server/ab-test-hello/index.tsx** | Done |
| 14 | *`AbKeyFeature`* | **server/ab-key-feature/index.tsx** | Done |
| 15 | *`AbSwitchBack`* | **server/ab-switch-back/index.tsx** | Done |


## Learn More abElements

To learn more about **`abElements`**, take a look at the following resources:

- [abElements Documentation](https://ab-elements.vercel.app/docs) - learn about abElements features and API.

You can check out [the abElements GitHub repository](https://github.com/abraham-ukachi/ab-elements-app) for more details.


## License

This **`ab-nextjs-components`** project is [MIT Licensed](./LICENSE) ;)



