// components/ClientMediaGrid.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import VideoPlayer from "../VideoPlayer";
import { MediaItem } from "@/types";

export default function ClientMediaGrid({ slug }: { slug: string }) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetch(`/api/media/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setMedia(data.media);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [slug]);

  if (loading) return <div className="text-center py-8">Loading media...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (media.length === 0) return null;

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
}
