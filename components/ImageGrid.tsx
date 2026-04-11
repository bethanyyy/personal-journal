"use client";

import React from "react";
import Image from "next/image";

import { JournalImage } from "@/types";

// Define the props this component expects
interface ImageGridProps {
  images: JournalImage[];
  slug: string; // Used for alt text and debugging
}

const ImageGrid = ({ images, slug }: ImageGridProps) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images found for this date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={image.key} className="relative aspect-square">
          <Image
            src={image.url}
            alt={`Journal image ${index + 1} for ${slug}`}
            fill
            className="object-cover rounded-sm hover:opacity-90 transition-opacity"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
