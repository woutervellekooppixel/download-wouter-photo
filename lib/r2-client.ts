import { S3 } from "aws-sdk";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT,
  R2_REGION,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
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

export class R2Client {
  folder: string;

  constructor(folder: string) {
    this.folder = folder;
  }

  async uploadFile(file: File, type: "zip" | "hero") {
    const ext = type === "zip" ? ".zip" : ".jpg";
    const key = `${this.folder}/${type}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3
      .putObject({
        Bucket: R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: type === "zip" ? "application/zip" : "image/jpeg",
      })
      .promise();
  }

  getPublicUrl(type: "zip" | "hero") {
    const ext = type === "zip" ? ".zip" : ".jpg";
    return `${R2_PUBLIC_URL}/${this.folder}/${type}${ext}`;
  }
}