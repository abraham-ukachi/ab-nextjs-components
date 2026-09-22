export type ComponentCatalogStatus = "Pending" | "InProgress" | "Done";

export type ComponentCatalogEntry = {
  name: string;
  file: string;
  kind: "client" | "server";
  status: ComponentCatalogStatus;
};

export declare const supportedComponents: Array<ComponentCatalogEntry>;

declare const abComponents: {
  supportedComponents: Array<ComponentCatalogEntry>;
};

export default abComponents;
