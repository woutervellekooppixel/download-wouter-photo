// lib/r2-utils.ts
import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { r2 } from './r2'

const BUCKET = process.env.R2_BUCKET_NAME!

export async function listObjects(prefix: string) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  })

  const response = await r2.send(command)
  return response.Contents || []
}

export async function deleteFolder(prefix: string) {
  const objects = await listObjects(prefix)

  for (const obj of objects) {
    if (obj.Key) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: obj.Key,
        })
      )
    }
  }
}

export async function uploadJson(key: string, json: object) {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(json, null, 2),
      ContentType: 'application/json',
    })
  )
}

export async function getJson(key: string) {
  const res = await r2.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )

  const stream = res.Body as NodeJS.ReadableStream
const chunks: Buffer[] = []
for await (const chunk of stream) {
  chunks.push(Buffer.from(chunk))
}

  const json = Buffer.concat(chunks).toString('utf-8')
  return JSON.parse(json)
}