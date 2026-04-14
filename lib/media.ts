import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

import { JournalImage, MediaItem } from "@/types";

// Initialize R2 client (this runs at build time)
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Get all journal date folders from R2
 * Returns array of date strings like ["15-04-2025", "16-04-2025"]
 */
export async function getAllImageJournalDates(): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Delimiter: "/",
    });

    const response = await r2Client.send(command);

    const folders =
      response.CommonPrefixes?.map((prefix) =>
        prefix.Prefix?.replace("/", ""),
      ).filter((folder): folder is string => Boolean(folder)) || [];

    return folders;
  } catch (error) {
    console.error("Error fetching folders from R2:", error);
    // no pages rebuilt
    return [];
  }
}

export async function getMediaForDate(slug: string): Promise<MediaItem[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: `${slug}/`,
    });

    const response = await r2Client.send(command);

    const media =
      response.Contents?.filter((obj) => {
        const key = obj.Key || "";
        const ext = key.split(".").pop()?.toLowerCase();
        // Allow both images and videos
        return [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp",
          "mp4",
          "mov",
          "avi",
          "mkv",
        ].includes(ext || "");
      }).map((obj) => {
        const key = obj.Key || "";
        const ext = key.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "mov", "avi", "mkv"].includes(ext || "");

        return {
          key: obj.Key!,
          url: `${process.env.R2_PUBLIC_URL}/${obj.Key}`,
          type: isVideo ? "video" : "image",
          size: obj.Size,
          // For videos, we can use a thumbnail if available, otherwise a poster frame
          thumbnail: isVideo
            ? `${process.env.R2_PUBLIC_URL}/${obj.Key}?thumbnail`
            : undefined,
        };
      }) || [];

    return media;
  } catch (error) {
    console.error(`Error fetching media for ${slug}:`, error);
    return [];
  }
}

/**
 * This function fetches all images for a specific date folder.
 * It runs at BUILD TIME for each slug from generateStaticParams.
 */
export async function getImagesForDate(slug: string): Promise<MediaItem[]> {
  return getMediaForDate(slug);
}

/**
 * Get the first image from a date folder (optimized - only fetches one image)
 * Returns the URL of the first image, or null if no images exist
 */
export async function getFirstImageForDate(
  slug: string,
): Promise<string | null> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: `${slug}/`,
      MaxKeys: 10, // Limit to first 10 objects (faster than fetching all)
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return null;
    }

    // Find the first image file
    const firstImage = response.Contents.find((obj) => {
      const key = obj.Key || "";
      const ext = key.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
    });

    if (!firstImage || !firstImage.Key) {
      return null;
    }

    return `${process.env.R2_PUBLIC_URL}/${firstImage.Key}`;
  } catch (error) {
    console.error(`Error getting first image for ${slug}:`, error);
    return null;
  }
}
