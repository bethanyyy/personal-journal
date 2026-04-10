// image-loader.ts
import type { ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  // In development, just return the original image
  if (process.env.NODE_ENV === "development") {
    return `${src}?${params.join("&")}`;
  }
  // In production, use Cloudflare's image CDN endpoint
  return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
