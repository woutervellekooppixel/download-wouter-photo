// scripts/r2.ts

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import path from "path";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET || "";

function formatTitle(name: string) {
  return name.replace(/[-_]/g, " ").replace(/\.(jpg|jpeg|png|zip)$/i, "").trim();
}

async function listFiles(prefix: string): Promise<string[]> {
  const command = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
  const result = await s3.send(command);
  return (
    result.Contents?.map((item) => item.Key).filter((key): key is string => Boolean(key)) || []
  );
}

export async function generateDataFromR2() {
  const PUBLIC_URL = "https://cdn.wouter.photo";
  const basePrefixes = ["photos/", "files/"];
  const downloads: Record<string, any> = {};

  for (const basePrefix of basePrefixes) {
    const rootItems = await listFiles(basePrefix);

    const folders = Array.from(
      new Set(rootItems.map((key) => key.split("/")[1]).filter(Boolean))
    );

    for (const slug of folders) {
      const fullPrefix = `${basePrefix}${slug}/`;
      const allKeys = await listFiles(fullPrefix);

      const zipFile = allKeys.find((f) => f.endsWith(".zip"));
      const heroImage = allKeys.find(
        (f) =>
          [".jpg", ".jpeg", ".png"].some((ext) => f.toLowerCase().endsWith(ext)) &&
          f.split("/").length === 2 // direct in de slug-map
      );

      // Gallery-secties detecteren (alleen bij 'photos/')
      const gallery: Record<string, string[]> = {};
      if (basePrefix === "photos/") {
        for (const key of allKeys) {
          const parts = key.split("/");
          if (parts.length === 3) {
            const folder = formatTitle(parts[1]);
            if (!gallery[folder]) gallery[folder] = [];
            gallery[folder].push(`${PUBLIC_URL}/${key}`);
          }
        }
      }

      downloads[slug] = {
        title: formatTitle(slug),
        downloadUrl: zipFile ? `${PUBLIC_URL}/${zipFile}` : undefined,
        heroImage: heroImage ? `${PUBLIC_URL}/${heroImage}` : undefined,
        gallery: Object.keys(gallery).length > 0 ? gallery : undefined,
      };
    }
  }

  return downloads;
}