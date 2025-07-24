import { S3 } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT,
  R2_REGION,
  R2_BUCKET_NAME,
} = process.env;

const s3 = new S3({
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
  endpoint: R2_ENDPOINT,
  region: R2_REGION,
  signatureVersion: "v4",
});

type DownloadEntry = {
  slug: string;
  title: string;
  downloadUrl: string;
  heroImage: string;
};

export async function updateDataJson(slug: string, newEntry: DownloadEntry) {
  const res = await s3
    .getObject({ Bucket: R2_BUCKET_NAME!, Key: "data.json" })
    .promise();

  const existing = JSON.parse(res.Body!.toString("utf-8"));
  existing[slug] = newEntry;

  await s3
    .putObject({
      Bucket: R2_BUCKET_NAME!,
      Key: "data.json",
      Body: JSON.stringify(existing, null, 2),
      ContentType: "application/json",
    })
    .promise();
}