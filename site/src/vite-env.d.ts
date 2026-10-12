/// <reference types="vite/client" />

declare module "virtual:crisp-docs" {
  import type { DocsData } from "../plugins/docs";
  const docs: DocsData;
  export default docs;
}
