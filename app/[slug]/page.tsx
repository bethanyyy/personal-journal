import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { getArticleData } from "@/lib/articles";

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import Image from "next/image";
import { notFound } from "next/navigation";

// Initialize R2 client (this runs at build time)
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Type for the image data
type JournalImage = {
  key: string;
  url: string;
};

export async function generateStaticParams() {
  try {
    // List all "folders" in R2 by using Delimiter='/'
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Delimiter: "/", // This groups by folder [citation:2]
    });

    const response = await r2Client.send(command);

    // Extract folder names from CommonPrefixes
    // CommonPrefixes contains the folder names ending with '/'
    const folders =
      response.CommonPrefixes?.map(
        (prefix) => prefix.Prefix?.replace("/", ""), // Remove trailing slash
      ).filter((folder): folder is string => Boolean(folder)) || [];

    // Return an array of { slug: "15-04-2025" } objects
    // Next.js will generate /journal/15-04-2025, /journal/16-04-2025, etc. [citation:4]
    return folders.map((folder) => ({
      slug: folder,
    }));
  } catch (error) {
    console.error("Error fetching folders from R2:", error);
    // Return empty array - no pages will be pre-built, but your site will still work
    return [];
  }
}

/**
 * This function fetches all images for a specific date folder.
 * It runs at BUILD TIME for each slug from generateStaticParams.
 */
async function getImagesForDate(slug: string): Promise<JournalImage[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: `${slug}/`, // Only list files inside this date's folder
    });

    const response = await r2Client.send(command);

    // Filter for image files and build their public URLs
    const images =
      response.Contents?.filter((obj) => {
        const key = obj.Key || "";
        const ext = key.split(".").pop()?.toLowerCase();
        return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
      }).map((obj) => ({
        key: obj.Key!,
        url: `${process.env.R2_PUBLIC_URL}/${obj.Key}`,
      })) || [];

    return images;
  } catch (error) {
    console.error(`Error fetching images for ${slug}:`, error);
    return [];
  }
}

const Article = async ({ params }: { params: { slug: string } }) => {
  const param = await params;
  const articleData = await getArticleData(param.slug);
  const images = await getImagesForDate(param.slug);

  return (
    <section className="mx-auto w-10/12 md:w-1/2 mt-20 flex flex-col gap-5">
      <div className="flex justify-between font-sans mb-5">
        <Link href={"/"} className="flex flex-row gap-1 place-items-center">
          <ArrowLeftIcon width={20} />
          <p>back to home</p>
        </Link>
        <p>{articleData.date.toString()}</p>
      </div>
      <article
        className="article font-serif"
        dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
      />
      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.key} className="relative aspect-square">
            <Image
              src={image.url}
              alt={`Journal image ${index + 1} for ${param.slug}`}
              fill
              className="object-cover rounded-lg hover:opacity-90 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Article;
export const dynamicParams = false;
