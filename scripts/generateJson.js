// scripts/generateJson.js
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const BUCKET = process.env.R2_BUCKET_NAME;
const REGION = process.env.R2_REGION;
const ENDPOINT = process.env.R2_ENDPOINT;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

console.log("🔍 BUCKET =", BUCKET);
console.log("📍 REGION =", REGION);
console.log("🌍 ENDPOINT =", ENDPOINT);

dotenv.config();

const s3 = new AWS.S3({
  endpoint: ENDPOINT,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  signatureVersion: 'v4',
});

const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

const PREFIXES = ['photos/', 'files/'];

async function listFolders(prefix) {
  const res = await s3
    .listObjectsV2({ Bucket: bucketName, Prefix: prefix, Delimiter: '/' })
    .promise();
  return res.CommonPrefixes?.map((p) => p.Prefix) || [];
}

async function listFilesInFolder(folder) {
  const res = await s3
    .listObjectsV2({ Bucket: bucketName, Prefix: folder })
    .promise();
  return res.Contents || [];
}

function toSlug(folderPath) {
  const name = folderPath.split('/').filter(Boolean).pop();
  return name?.replace(/\s+/g, '-').toLowerCase() || '';
}

function toTitle(folderPath) {
  const name = folderPath.split('/').filter(Boolean).pop();
  return name?.replace(/[_-]/g, ' ') || '';
}

async function generateJson() {
  const result = {};

  for (const prefix of PREFIXES) {
    const folders = await listFolders(prefix);

    for (const folder of folders) {
      const slug = toSlug(folder);
      const title = toTitle(folder);
      const files = await listFilesInFolder(folder);

      const zip = files.find((f) => f.Key?.endsWith('.zip'));
      const jpg = files.find((f) => f.Key?.endsWith('.jpg') || f.Key?.endsWith('.jpeg'));

      if (!zip || !jpg) {
        console.warn(`⚠️  Skipping "${folder}" — missing zip or jpg`);
        continue;
      }

      result[slug] = {
        title,
        downloadUrl: `${publicUrl}/${zip.Key}`,
        heroImage: `${publicUrl}/${jpg.Key}`,
      };
    }
  }

  // Schrijf naar local file (optioneel)
  const jsonPath = path.join(process.cwd(), 'public', 'data.json');
  const jsonString = JSON.stringify(result, null, 2);
  fs.writeFileSync(jsonPath, jsonString);

  await s3
    .putObject({
      Bucket: bucketName,
      Key: 'data.json',
      Body: jsonString,
      ContentType: 'application/json',
      ACL: 'public-read', // of laat weg als je bucket al public is
    })
    .promise();

  console.log("✅ data.json gegenereerd én geüpload naar R2");
}

generateJson().catch((err) => {
  console.error("❌ Fout bij genereren van data.json:", err);
});