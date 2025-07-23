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
  return (
    result.Contents?.map((item) => item.Key).filter((key): key is string => Boolean(key)) || []
  );
}

export async function generateDataFromR2() {
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
          f.split("/").length === 2
      );

      const gallery: Record<string, string[]> = {};

      // Voeg alle subfolders toe als gallery-sectie
      const subfolders = new Set(
        allKeys
          .map((key) => {
            const parts = key.split("/");
            return parts.length >= 3 ? parts[2].split("/")[0] : null;
          })
          .filter(Boolean)
      );

      for (const folder of subfolders) {
        const sectionTitle = formatTitle(folder);
        gallery[sectionTitle] = allKeys
          .filter((key) => key.includes(`/${folder}/`))
          .filter((key) => /\.(jpg|jpeg|png)$/i.test(key))
          .map((key) => `${PUBLIC_URL}/${key}`);
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