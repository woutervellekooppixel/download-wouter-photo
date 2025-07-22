// scripts/r2.ts

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET || "";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

function formatTitle(name: string) {
  return name.replace(/[-_]/g, " ").replace(/\.(jpg|jpeg|png|zip)$/i, "").trim();
}

export async function listFoldersWithFiles() {
  const basePrefixes = ["files/", "photos/"];
  const downloads: Record<string, any> = {};

  for (const prefix of basePrefixes) {
    const listCommand = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
    const result = await s3.send(listCommand);
    if (!result.Contents) continue;

    const folders = new Set(
      result.Contents.map((item) => item.Key?.split("/")[1]).filter(Boolean)
    );

    for (const slug of folders) {
      const prefixFull = `${prefix}${slug}/`;
      const res = await s3.send(
        new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefixFull })
      );
      const contents = res.Contents?.map((item) => item.Key).filter(Boolean) || [];

      const zipFile = contents.find((f) => f && f.endsWith(".zip"));

      const heroImage = contents.find((f) =>
        f &&
        [".jpg", ".jpeg", ".png"].some((ext) => f.toLowerCase().endsWith(ext)) &&
        f.split("/").length === 2 // enkel bestand in root van slug-map
      );

      const galleryFolders: Record<string, string[]> = {};
      for (const item of contents) {
        if (!item) continue;
        const parts = item.split("/");
        if (parts.length === 3) {
          const folder = parts[1];
          const file = parts[2];
          if (!galleryFolders[folder]) galleryFolders[folder] = [];
          galleryFolders[folder].push(`${PUBLIC_URL}/${item}`);
        }
      }

      downloads[slug] = {
        title: formatTitle(slug),
        downloadUrl: zipFile ? `${PUBLIC_URL}/${zipFile}` : undefined,
        heroImage: heroImage ? `${PUBLIC_URL}/${heroImage}` : undefined,
        gallery: Object.fromEntries(
          Object.entries(galleryFolders).map(([folder, images]) => [
            formatTitle(folder),
            images,
          ])
        ),
      };
    }
  }

  return downloads;
}