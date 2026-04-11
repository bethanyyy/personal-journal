import type { NextConfig } from "next";
// import cloudflareLoader from "./image-loader";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // loader: "custom",
    // loaderFile: "./image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-*.r2.dev", // Use a wildcard for your R2 subdomain
        port: "",
        pathname: "/**",
      },
      // If you set up a custom domain for your bucket, add it here
      // {
      //   protocol: "https",
      //   hostname: "images.yourdomain.com",
      //   port: "",
      //   pathname: "/**",
      // },
    ],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@mdx-js/react"],
};

const withMDX = createMDX({
  options: {
    // You can leave these empty for basic Markdown
    remarkPlugins: [
      "remark-frontmatter", // First: parse the frontmatter syntax
      "remark-mdx-frontmatter", // Second: convert it to exports
    ],
    rehypePlugins: [],
    jsx: true,
  },
});

export default withMDX(nextConfig);
