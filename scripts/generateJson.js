import pkg from "aws-sdk";
const { S3 } = pkg;
import { writeFile } from "fs/promises";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: "auto",
});

const bucket = process.env.R2_BUCKET;
const publicUrl = process.env.R2_PUBLIC_URL;

function parseFolderName(name) {
  return name.replace(/_/g, " ").replace(/-/g, " ").trim();
}

async function listFolders(prefix) {
  const res = await s3
    .listObjectsV2({ Bucket: bucket, Prefix: prefix, Delimiter: "/" })
    .promise();

  return (res.CommonPrefixes || [])
    .map((p) => p.Prefix?.replace(prefix, "").replace("/", ""))
    .filter(Boolean);
}

async function generateDataJson() {
  const result = {};

  // 📷 PHOTO folders
  const photoFolders = await listFolders("photos/");
  for (const folder of photoFolders) {
    const slug = folder;
    const title = parseFolderName(slug);
    result[slug] = {
      title,
      downloadUrl: `${publicUrl}/photos/${slug}/${slug}.zip`,
      heroImage: `${publicUrl}/photos/${slug}/hero.jpg`,
    };
  }

  // 📁 FILE folders
  const fileFolders = await listFolders("files/");
  for (const folder of fileFolders) {
    const slug = folder;
    const title = parseFolderName(slug);
    result[slug] = {
      title,
      downloadUrl: `${publicUrl}/files/${slug}/${slug}.zip`,
      heroImage: `${publicUrl}/files/${slug}/hero.jpg`,
    };
  }

  // 💾 Schrijf naar public/data.json
  const outputPath = path.join(process.cwd(), "public/data.json");
  await writeFile(outputPath, JSON.stringify(result, null, 2));
  console.log("✅ data.json gegenereerd");
}

generateDataJson().catch(console.error);