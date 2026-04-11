"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface HoverPreviewProps {
  children: React.ReactNode;
  thumbnailUrl: string | null;
}

const HoverPreview = ({ children, thumbnailUrl }: HoverPreviewProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Add offset so cursor doesn't block the thumbnail
    setPosition({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  const handleMouseEnter = () => {
    // Small delay before showing (prevents flashing)
    timeoutRef.current = setTimeout(() => {
      setIsHovering(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="inline-block"
    >
      {children}

      {/* Thumbnail preview */}
      {isHovering && thumbnailUrl && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(0, 0)",
          }}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="relative w-48 h-32">
              <Image
                src={thumbnailUrl}
                alt={""}
                fill
                className="object-cover"
                sizes="(max-width: 192px) 100vw"
                quality={75}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverPreview;
