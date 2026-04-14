// app/api/media/[slug]/route.ts
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const param = await params;
  const slug = await param.slug;

  // server side code
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
        return ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov"].includes(
          ext || "",
        );
      }).map((obj) => {
        const key = obj.Key || "";
        const ext = key.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "mov", "avi", "mkv"].includes(ext || "");
        return {
          key: obj.Key,
          url: `${process.env.R2_PUBLIC_URL}/${obj.Key}`,
          type: isVideo ? "video" : "image",
        };
      }) || [];

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}
