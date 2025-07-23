import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET || "";

export async function uploadToR2(filename: string, content: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: filename,
    Body: content,
    ContentType: "application/json",
  });

  await s3.send(command);
}