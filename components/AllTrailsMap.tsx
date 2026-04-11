"use client";

interface AllTrailsMapProps {
  trailPath: string;
  height?: number;
  width?: string;
}

export default function AllTrailsMap({
  trailPath,
  height = 400,
  width = "100%",
}: AllTrailsMapProps) {
  const src = `https://www.alltrails.com/widget/trail/${trailPath}?u=m&sh=n16msl`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md my-4">
      <iframe
        src={src}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        title="AllTrails: Trail Guides and Maps"
        className="block"
        loading="lazy"
      />
    </div>
  );
}
