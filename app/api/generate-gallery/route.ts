import { NextResponse } from 'next/server'
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3'

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_ENDPOINT,
  R2_REGION,
} = process.env

const r2 = new S3Client({
  region: R2_REGION!,
  endpoint: R2_ENDPOINT!,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  const { slug } = await req.json()

  const prefix = `photos/${slug}/`

  const result = await r2.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME!,
      Prefix: prefix,
    })
  )

  const folders: Record<string, string[]> = {}

  for (const item of result.Contents || []) {
    const key = item.Key!
    if (key.endsWith('.jpg')) {
      const parts = key.split('/')
      if (parts.length >= 4) {
        const folder = decodeURIComponent(parts[2])
        folders[folder] ||= []
        folders[folder].push(`https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/${key}`)
      }
    }
  }

  const json = JSON.stringify(folders, null, 2)

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME!,
      Key: `photos/${slug}/gallery.json`,
      Body: json,
      ContentType: 'application/json',
    })
  )

  return NextResponse.json({ success: true, folders: Object.keys(folders) })
}