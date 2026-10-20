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
* @name: index.d.ts
* @file: types/index.d.ts
* @type: TypeScript Declarations
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

export type ComponentCatalogStatus = 'Pending' | 'InProgress' | 'Done';

export type ComponentCatalogEntry = {
  name: string;
  file: string;
  kind: 'client' | 'server';
  status: ComponentCatalogStatus;
};

export declare const supportedComponents: Array<ComponentCatalogEntry>;

declare const abComponents: {
  supportedComponents: Array<ComponentCatalogEntry>;
};

export default abComponents;

export { default as AbIcon } from '../ab-icon/index.tsx';
export { default as AbLogo } from '../ab-logo/index.tsx';
// 📶 progress bar (ported from core)
export { default as AbLinearProgress } from '../ab-linear-progress/index.tsx';
export { default as AbButton } from '../ab-button/index.tsx';
export { default as AbIconButton } from '../ab-icon-button/index.tsx';
export { default as AbInput } from '../ab-input/index.tsx';
export { default as AbBalloon } from '../ab-balloon/index.tsx';
export { default as AbAvatar } from '../ab-avatar/index.tsx';
export { default as AbTab } from '../ab-tab/index.tsx';
export { default as AbTabs } from '../ab-tabs/index.tsx';
export { default as AbMenu } from '../ab-menu/index.tsx';
export { default as AbCollapsible } from '../ab-collapsible/index.tsx';
export { default as AbColor } from '../ab-color/index.tsx';
export { default as AbInfo } from '../ab-info/index.tsx';
export { default as AbLikeButton } from '../ab-like-button/index.tsx';
export { default as AbSearchbar } from '../ab-searchbar/index.tsx';
export { default as AbSearchResult } from '../ab-search-result/index.tsx';
export { default as AbPagePaginator } from '../ab-page-paginator/index.tsx';
export { default as AbPageSwitcher } from '../ab-page-switcher/index.tsx';
export { default as AbProgressChips } from '../ab-progress-chips/index.tsx';
export { default as AbPrice } from '../ab-price/index.tsx';
export { default as AbPriceTag } from '../ab-price-tag/index.tsx';
export { default as AbImage } from '../ab-image/index.tsx';
export { default as AbBrand } from '../ab-brand/index.tsx';
export { default as AbName } from '../ab-name/index.tsx';
export { default as AbNavbar } from '../ab-navbar/index.tsx';
export { default as AbSidebar } from '../ab-sidebar/index.tsx';
// 📑 0.1.13 (Joseph): AbToc + the panes main-scroller helpers (also at `ab-nextjs-components/ab-toc`)
export { default as AbToc, getAbMainScroller, AB_MAIN_SCROLLER_SELECTOR } from '../ab-toc/index.tsx';
export type { AbTocItem, AbTocProps } from '../ab-toc/index.tsx';
// 🗄️ 0.1.14 (G53): AbDrawer + useAbDrawer (also at `ab-nextjs-components/ab-drawer`)
export { default as AbDrawer, useAbDrawer, getAbDrawerHost, AB_DRAWER_DURATION } from '../ab-drawer/index.tsx';
export type { AbDrawerProps, AbDrawerSide, AbDrawerScope, UseAbDrawer } from '../ab-drawer/index.tsx';
export { default as AbDrawerList } from '../ab-drawer-list/index.tsx';
export type { AbDrawerListItem, AbDrawerListProps } from '../ab-drawer-list/index.tsx';
export { default as AbConfirmDrawer } from '../ab-confirm-drawer/index.tsx';
export type { AbConfirmDrawerProps } from '../ab-confirm-drawer/index.tsx';
// 🍞 0.1.14 (P2): AbBreadcrumbs
export { default as AbBreadcrumbs } from '../ab-breadcrumbs/index.tsx';
export type { AbBreadcrumbItem, AbBreadcrumbsProps } from '../ab-breadcrumbs/index.tsx';
// 📋 0.1.14 (P13): AbList + AbListItem
export { default as AbList, AbListItem } from '../ab-list/index.tsx';
export type { AbListProps, AbListItemProps } from '../ab-list/index.tsx';
export { default as AbText } from '../ab-text/index.tsx';
export { default as AbTestHello } from '../ab-test-hello/index.tsx';
export { default as AbKeyFeature } from '../ab-key-feature/index.tsx';
export { default as AbMainHeadline } from '../ab-main-headline/index.tsx';
export { default as AbPreview } from '../ab-preview/index.tsx';
export { default as AbProduct } from '../ab-product/index.tsx';
export { default as AbProductItem } from '../ab-product-item/index.tsx';
export { default as AbSwitchBack } from '../ab-switch-back/index.tsx';
export { default as AbDemoBox } from '../ab-demo-box/index.tsx';
export { default as AbDemoCode } from '../ab-demo-code/index.tsx';
export { default as AbPolygon } from '../server/ab-polygon/index.tsx';
