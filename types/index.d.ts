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

export { default as AbIcon } from '../ab-icon';
export { default as AbLogo } from '../ab-logo';
export { default as AbButton } from '../ab-button';
export { default as AbIconButton } from '../ab-icon-button';
export { default as AbInput } from '../ab-input';
export { default as AbBalloon } from '../ab-balloon';
export { default as AbAvatar } from '../ab-avatar';
export { default as AbTab } from '../ab-tab';
export { default as AbTabs } from '../ab-tabs';
export { default as AbMenu } from '../ab-menu';
export { default as AbCollapsible } from '../ab-collapsible';
export { default as AbColor } from '../ab-color';
export { default as AbInfo } from '../ab-info';
export { default as AbLikeButton } from '../ab-like-button';
