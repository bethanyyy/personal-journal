"use client";

import React from "react";
import Image from "next/image";

import { MediaItem } from "@/types";
import VideoPlayer from "./VideoPlayer";

// Define the props this component expects
interface MediaGridProps {
  media: MediaItem[];
  slug: string; // Used for alt text and debugging
}

const MediaGrid = ({ media, slug }: MediaGridProps) => {
  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images found for this date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {media.map((item, index) => (
        <div key={item.key} className="relative aspect-square">
          {item.type === "video" ? (
            <VideoPlayer src={item.url} title={""} />
          ) : (
            <Image
              src={item.url}
              alt={""}
              fill
              className="object-cover rounded-lg hover:opacity-90 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
