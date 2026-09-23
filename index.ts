/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* @project: ab-nextjs-components
* @name: Components - Package Catalog
* @file: index.ts
*/

import type { ComponentCatalogEntry } from './types'

/**
 * Catalog — Phase 2–4 + Skip-override (Phase 5 components) marked Done.
 * Barrel re-exports use explicit /index.tsx paths (avoid DIR_IMPORT).
 */
const supportedComponents: Array<ComponentCatalogEntry> = [
  // CLIENT
  { name: 'AbIcon', file: 'ab-icon/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbLogo', file: 'ab-logo/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbButton', file: 'ab-button/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbIconButton', file: 'ab-icon-button/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbInput', file: 'ab-input/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbBalloon', file: 'ab-balloon/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbAvatar', file: 'ab-avatar/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbTab', file: 'ab-tab/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbTabs', file: 'ab-tabs/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbMenu', file: 'ab-menu/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbCollapsible', file: 'ab-collapsible/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbColor', file: 'ab-color/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbInfo', file: 'ab-info/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbLikeButton', file: 'ab-like-button/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbSearchbar', file: 'ab-searchbar/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbSearchResult', file: 'ab-search-result/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbPagePaginator', file: 'ab-page-paginator/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbPageSwitcher', file: 'ab-page-switcher/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbProgressChips', file: 'ab-progress-chips/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbPrice', file: 'ab-price/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbPriceTag', file: 'ab-price-tag/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbImage', file: 'ab-image/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbBrand', file: 'ab-brand/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbName', file: 'ab-name/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbNavbar', file: 'ab-navbar/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbSidebar', file: 'ab-sidebar/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbText', file: 'ab-text/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbTestHello', file: 'ab-test-hello/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbKeyFeature', file: 'ab-key-feature/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbMainHeadline', file: 'ab-main-headline/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbPreview', file: 'ab-preview/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbProduct', file: 'ab-product/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbProductItem', file: 'ab-product-item/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbSwitchBack', file: 'ab-switch-back/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbDemoBox', file: 'ab-demo-box/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbDemoCode', file: 'ab-demo-code/index.tsx', kind: 'client', status: 'Done' },

  // SERVER
  { name: 'AbIcon', file: 'server/ab-icon/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbLogo', file: 'server/ab-logo/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbButton', file: 'server/ab-button/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbAvatar', file: 'server/ab-avatar/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbBadge', file: 'server/ab-badge/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbPolygon', file: 'server/ab-polygon/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbBrand', file: 'server/ab-brand/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbName', file: 'server/ab-name/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbNavbar', file: 'server/ab-navbar/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbSidebar', file: 'server/ab-sidebar/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbNavLink', file: 'server/ab-nav-link/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbText', file: 'server/ab-text/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbTestHello', file: 'server/ab-test-hello/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbKeyFeature', file: 'server/ab-key-feature/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbSwitchBack', file: 'server/ab-switch-back/index.tsx', kind: 'server', status: 'Done' },
]

const abComponents = { supportedComponents }

export { supportedComponents }
export default abComponents

export { default as AbIcon } from './ab-icon/index.tsx'
export { default as AbLogo } from './ab-logo/index.tsx'
export { default as AbButton } from './ab-button/index.tsx'
export { default as AbIconButton } from './ab-icon-button/index.tsx'
export { default as AbInput } from './ab-input/index.tsx'
export { default as AbBalloon } from './ab-balloon/index.tsx'
export { default as AbAvatar } from './ab-avatar/index.tsx'
export { default as AbTab } from './ab-tab/index.tsx'
export { default as AbTabs } from './ab-tabs/index.tsx'
export { default as AbMenu } from './ab-menu/index.tsx'
export { default as AbCollapsible } from './ab-collapsible/index.tsx'
export { default as AbColor } from './ab-color/index.tsx'
export { default as AbInfo } from './ab-info/index.tsx'
export { default as AbLikeButton } from './ab-like-button/index.tsx'
export { default as AbSearchbar } from './ab-searchbar/index.tsx'
export { default as AbSearchResult } from './ab-search-result/index.tsx'
export { default as AbPagePaginator } from './ab-page-paginator/index.tsx'
export { default as AbPageSwitcher } from './ab-page-switcher/index.tsx'
export { default as AbProgressChips } from './ab-progress-chips/index.tsx'
export { default as AbPrice } from './ab-price/index.tsx'
export { default as AbPriceTag } from './ab-price-tag/index.tsx'
export { default as AbImage } from './ab-image/index.tsx'
export { default as AbBrand } from './ab-brand/index.tsx'
export { default as AbName } from './ab-name/index.tsx'
export { default as AbNavbar } from './ab-navbar/index.tsx'
export { default as AbSidebar } from './ab-sidebar/index.tsx'
export { default as AbText } from './ab-text/index.tsx'
export { default as AbTestHello } from './ab-test-hello/index.tsx'
export { default as AbKeyFeature } from './ab-key-feature/index.tsx'
export { default as AbMainHeadline } from './ab-main-headline/index.tsx'
export { default as AbPreview } from './ab-preview/index.tsx'
export { default as AbProduct } from './ab-product/index.tsx'
export { default as AbProductItem } from './ab-product-item/index.tsx'
export { default as AbSwitchBack } from './ab-switch-back/index.tsx'
export { default as AbDemoBox } from './ab-demo-box/index.tsx'
export { default as AbDemoCode } from './ab-demo-code/index.tsx'
export { default as AbPolygon } from './server/ab-polygon/index.tsx'
