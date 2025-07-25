// lib/r2.ts
import { S3Client } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: process.env.R2_REGION ?? 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})