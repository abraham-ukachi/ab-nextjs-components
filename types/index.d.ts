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
export { default as AbPolygon } from '../server/ab-polygon/index.tsx';
