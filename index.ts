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
* @name: Components - Package Catalog
* @file: index.ts
* @type: Package catalog + barrel
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  // 📶 AbLinearProgress (ported from core; used by AbSplash)
  { name: 'AbLinearProgress', file: 'ab-linear-progress/index.tsx', kind: 'client', status: 'Done' },
  // 💦 AbSplash: subpath-only (`ab-nextjs-components/ab-splash`)
  { name: 'AbSplash', file: 'ab-splash/index.tsx', kind: 'client', status: 'Done' },
  // 🎠 G31 AbCarousel (Welcome v6): subpath-only (`ab-nextjs-components/ab-carousel`), needs ab-nextjs-hooks >= 0.1.6
  { name: 'AbCarousel', file: 'ab-carousel/index.tsx', kind: 'client', status: 'Done' },
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
  // 🆕 Welcome v6 (AbThemeToggle)
  { name: 'AbThemeToggle', file: 'ab-theme-toggle/index.tsx', kind: 'client', status: 'Done' },
  // 🆕 Welcome v6 (AbChip)
  { name: 'AbChip', file: 'ab-chip/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 Welcome v6 (AbPill)
  { name: 'AbPill', file: 'ab-pill/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 Welcome v6 (AbInstallSnippet)
  { name: 'AbInstallSnippet', file: 'ab-install-snippet/index.tsx', kind: 'client', status: 'Done' },
  // 🆕 Welcome v6 (AbLocaleSwitcher)
  { name: 'AbLocaleSwitcher', file: 'ab-locale-switcher/index.tsx', kind: 'client', status: 'Done' },
  // 🆕 Welcome v6 (AbFlowDiagram)
  { name: 'AbFlowDiagram', file: 'ab-flow-diagram/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbLink)
  { name: 'AbLink', file: 'ab-link/index.tsx', kind: 'client', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbKbd) — server-safe, no hooks
  { name: 'AbKbd', file: 'ab-kbd/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbSearchTrigger)
  { name: 'AbSearchTrigger', file: 'ab-search-trigger/index.tsx', kind: 'client', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbAppBar)
  { name: 'AbAppBar', file: 'ab-app-bar/index.tsx', kind: 'client', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbCard) — server-safe, no hooks
  { name: 'AbCard', file: 'ab-card/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbPackageCard) — server-safe, no hooks
  { name: 'AbPackageCard', file: 'ab-package-card/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 0.1.13 docs shell (AbToc) — server-safe, no hooks
  { name: 'AbToc', file: 'ab-toc/index.tsx', kind: 'server', status: 'Done' },
  // 🆕 0.1.14 (G53): AbDrawer + presets
  { name: 'AbDrawer', file: 'ab-drawer/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbDrawerList', file: 'ab-drawer-list/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbConfirmDrawer', file: 'ab-confirm-drawer/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbBottomDrawer', file: 'ab-bottom-drawer/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbMobileHeader', file: 'ab-mobile-header/index.tsx', kind: 'client', status: 'Done' }, // 🆕 0.2.0 drawers v2
  { name: 'AbSearchDrawer', file: 'ab-search-drawer/index.tsx', kind: 'client', status: 'Done' }, // 🆕 0.2.0 drawers v2
  { name: 'AbTocDrawer', file: 'ab-toc-drawer/index.tsx', kind: 'client', status: 'Done' }, // 🆕 0.2.0 drawers v2
  { name: 'AbNavDrawer', file: 'ab-nav-drawer/index.tsx', kind: 'client', status: 'Done' }, // 🆕 0.2.0 drawers v2
  { name: 'AbSettingsDrawer', file: 'ab-settings-drawer/index.tsx', kind: 'client', status: 'Done' }, // 🆕 0.2.0 drawers v2
  { name: 'AbSidebarProfileButton', file: 'ab-sidebar/profile-button.tsx', kind: 'client', status: 'Done' }, // 🆕 0.2.1 bottom-left profile → settings (≥ 1180px)
  { name: 'AbProfileAvatar', file: 'ab-profile-avatar/index.tsx', kind: 'server', status: 'Done' }, // 🆕 0.2.1 initials / photo / glyph circle (no hooks: client + server)
  { name: 'AbVersionSwitcher', file: 'ab-version-switcher/index.tsx', kind: 'client', status: 'Done' },
  { name: 'AbBreadcrumbs', file: 'ab-breadcrumbs/index.tsx', kind: 'server', status: 'Done' },
  { name: 'AbList', file: 'ab-list/index.tsx', kind: 'server', status: 'Done' },
]

const abComponents = { supportedComponents }

export { supportedComponents }
export default abComponents

export { default as AbIcon } from './ab-icon/index.tsx'
export { AbIconRegistrar } from './ab-icon/registrar.tsx' // 🗂️ server-safe icon registration (0.1.13)
export { default as AbLogo } from './ab-logo/index.tsx'
// 📶 progress bar
export { default as AbLinearProgress } from './ab-linear-progress/index.tsx'
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
// 👤 0.2.1 (God 02:44): the bottom-left sidebar profile button → AbSettingsDrawer (laptop + wide)
export { default as AbSidebarProfileButton } from './ab-sidebar/profile-button.tsx'
export type { AbSidebarProfileButtonProps } from './ab-sidebar/profile-button.tsx'
// 📑 0.1.13 (Joseph): AbToc + the panes main-scroller helpers (also at `ab-nextjs-components/ab-toc`)
export { default as AbToc, getAbMainScroller, AB_MAIN_SCROLLER_SELECTOR } from './ab-toc/index.tsx'
export type { AbTocItem, AbTocProps } from './ab-toc/index.tsx'
// 🗄️ 0.1.14 (G53): AbDrawer + useAbDrawer (also at `ab-nextjs-components/ab-drawer`)
export { default as AbDrawer, useAbDrawer, getAbDrawerHost, AB_DRAWER_DURATION } from './ab-drawer/index.tsx'
// 🤏 0.2.0 drawers v2: edge swipes + the swipe / snap rules
export { useAbEdgeSwipe, AB_SWIPE, resolveAbSheetRelease, resolveAbSideRelease } from './ab-drawer/index.tsx'
export type { AbDrawerTier, AbSheetSnap, UseAbEdgeSwipeOptions } from './ab-drawer/index.tsx'
export type { AbDrawerProps, AbDrawerSide, AbDrawerScope, UseAbDrawer } from './ab-drawer/index.tsx'
export { default as AbDrawerList } from './ab-drawer-list/index.tsx'
export type { AbDrawerListItem, AbDrawerListProps } from './ab-drawer-list/index.tsx'
export { default as AbConfirmDrawer } from './ab-confirm-drawer/index.tsx'
export type { AbConfirmDrawerProps } from './ab-confirm-drawer/index.tsx'
// 📱 0.1.14 (D40): AbBottomDrawer, the mobile bottom drawer
export { default as AbBottomDrawer } from './ab-bottom-drawer/index.tsx'
export type { AbBottomDrawerProps } from './ab-bottom-drawer/index.tsx'
// 🆕 0.2.0 drawers v2: AbMobileHeader
export { default as AbMobileHeader } from './ab-mobile-header/index.tsx'
export type { AbMobileHeaderProps } from './ab-mobile-header/index.tsx'
// 🆕 0.2.0 drawers v2: AbSearchDrawer
export { default as AbSearchDrawer, addAbSearchRecent, highlightAbSearch, AB_SEARCH_RECENT_KEY } from './ab-search-drawer/index.tsx'
export type { AbSearchDrawerProps, AbSearchDrawerItem, AbSearchDrawerGroup, AbSearchDrawerLabels } from './ab-search-drawer/index.tsx'
// 🆕 0.2.0 drawers v2: AbTocDrawer
export { default as AbTocDrawer } from './ab-toc-drawer/index.tsx'
export type { AbTocDrawerProps, AbTocDrawerLink } from './ab-toc-drawer/index.tsx'
// 🆕 0.2.0 drawers v2: AbNavDrawer
export { default as AbNavDrawer } from './ab-nav-drawer/index.tsx'
export type { AbNavDrawerProps, AbNavDrawerItem, AbNavDrawerSection } from './ab-nav-drawer/index.tsx'
// 🆕 0.2.0 drawers v2: AbSettingsDrawer
export { default as AbSettingsDrawer } from './ab-settings-drawer/index.tsx'
export type { AbSettingsDrawerProps, AbSettingsDrawerLabels, AbSettingsLocale, AbSettingsTheme } from './ab-settings-drawer/index.tsx'
// 👤 0.2.1: the profile circle (initials / photo / signed-out glyph)
export { default as AbProfileAvatar, getAbInitials } from './ab-profile-avatar/index.tsx'
export type { AbProfileAvatarProps, AbProfileUser } from './ab-profile-avatar/index.tsx'
// 🏷️ 0.1.14 (P9): AbVersionSwitcher
export { default as AbVersionSwitcher } from './ab-version-switcher/index.tsx'
export type { AbVersionOption, AbVersionSwitcherProps } from './ab-version-switcher/index.tsx'
// 🍞 0.1.14 (P2): AbBreadcrumbs
export { default as AbBreadcrumbs } from './ab-breadcrumbs/index.tsx'
export type { AbBreadcrumbItem, AbBreadcrumbsProps } from './ab-breadcrumbs/index.tsx'
// 📋 0.1.14 (P13): AbList + AbListItem
export { default as AbList, AbListItem } from './ab-list/index.tsx'
export type { AbListProps, AbListItemProps } from './ab-list/index.tsx'
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
