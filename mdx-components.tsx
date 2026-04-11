import type { MDXComponents } from "mdx/types";

import ImageGrid from "./components/ImageGrid";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // You can customize any HTML element here
    ...components,
    ImageGrid,
  };
}
