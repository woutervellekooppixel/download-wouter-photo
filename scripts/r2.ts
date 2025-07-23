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
const PUBLIC_URL = "https://cdn.wouter.photo";

function formatTitle(name: string) {
  return name.replace(/[-_]/g, " ").replace(/\.(jpg|jpeg|png|zip)$/i, "").trim();
}

async function listFiles(prefix: string): Promise<string[]> {
  const command = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
  const result = await s3.send(command);
  return result.Contents?.map((item) => item.Key!).filter(Boolean) || [];
}

export async function generateDataFromR2() {
  const basePrefixes = ["photos/", "files/"];
  const downloads: Record<string, any> = {};

  for (const basePrefix of basePrefixes) {
    const rootKeys = await listFiles(basePrefix);
    const slugs = Array.from(new Set(rootKeys.map(key => key.split("/")[1]))).filter(Boolean);

    for (const slug of slugs) {
      const fullPrefix = `${basePrefix}${slug}/`;
      const keys = await listFiles(fullPrefix);

      let zipFile: string | undefined;
      let heroImage: string | undefined;
      const gallery: Record<string, string[]> = {};

      for (const key of keys) {
        const relativePath = key.replace(fullPrefix, "");
        const url = `${PUBLIC_URL}/${key}`;

        // ZIP-bestand detecteren (alleen in hoofdmap)
        if (relativePath.endsWith(".zip") && !relativePath.includes("/")) {
          zipFile = url;
        }

        // Hero image detecteren (alleen in hoofdmap)
        if (
          !heroImage &&
          [".jpg", ".jpeg", ".png"].some(ext => relativePath.toLowerCase().endsWith(ext)) &&
          !relativePath.includes("/")
        ) {
          heroImage = url;
        }

        // Submappen voor gallery-secties
        const parts = relativePath.split("/");
        if (parts.length >= 2 && [".jpg", ".jpeg", ".png"].some(ext => parts[1].toLowerCase().endsWith(ext))) {
          const folderName = formatTitle(parts[0]);
          if (!gallery[folderName]) gallery[folderName] = [];
          gallery[folderName].push(url);
        }
      }

      downloads[slug] = {
        title: formatTitle(slug),
        downloadUrl: zipFile,
        heroImage,
        gallery: Object.keys(gallery).length > 0 ? gallery : undefined,
      };
    }
  }

  return downloads;
}