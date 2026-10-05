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




## Tooling (Phase 1)

- Next.js **16.3.4** / React **19** hard peers
- ESLint 9 flat + Vitest
- Package ships as TypeScript (`type: module`) with a `supportedComponents` catalog
- Phase 2 Adapt complete; Phase 4 + Skip-override (Phase 5 components) complete (local)



### Sidebar, menu & logo (0.1.6)

* `<AbSidebar>` is a **`<nav data-ab-part="sidebar">`** (not `<aside>`). Pair with `ab-nextjs-core@^0.1.4` + `ab-nextjs-hooks@^0.1.4` so aside dialogs target `aside.AbAsideLayout`.
* `<AbMenu id>` also sets **`data-id`**, so `useAbMenu` can find it.
* `<AbLogo>` defaults to the Ab logo **shipped in this package** (data URI / `ab-logo/ab-logo.svg`). Pass `src` to override.


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



