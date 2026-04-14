// components/VideoPlayer.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export default function VideoPlayer({
  src,

  title,
  autoPlay = false,
  loop = false,
  controls = true,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover rounded-lg"
        loop={loop}
        playsInline
        controls={isPlaying && controls}
        onClick={handlePlay}
      />

      {/* Play button overlay - only shows when not playing and hovering */}
      {!isPlaying && isHovering && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
          aria-label="Play video"
        >
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center transform transition-transform hover:scale-110">
            <svg
              className="w-8 h-8 text-gray-800 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Video indicator badge */}
      {!isPlaying && (
        <div className="absolute top-2 right-2 font-sans bg-white text-black text-xs px-2 py-1 rounded flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Video</span>
        </div>
      )}
    </div>
  );
}
