import type { NextConfig } from "next";
import cloudflareLoader from "./image-loader";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
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
};

export default nextConfig;
