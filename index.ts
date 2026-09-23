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
 * Catalog — Phase 2 Adapt + Phase 3 Port + Phase 4 Port marked Done.
 * Barrel re-exports use explicit /index.tsx paths so Node/Turbopack ESM
 * resolution does not hit ERR_UNSUPPORTED_DIR_IMPORT.
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

  // SERVER
  { name: 'AbIcon', file: 'server/ab-icon/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbLogo', file: 'server/ab-logo/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbButton', file: 'server/ab-button/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbAvatar', file: 'server/ab-avatar/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbBadge', file: 'server/ab-badge/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbPolygon', file: 'server/ab-polygon/index.tsx', kind: 'server', status: 'Done' },
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
export { default as AbPolygon } from './server/ab-polygon/index.tsx'
