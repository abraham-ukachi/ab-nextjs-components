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
