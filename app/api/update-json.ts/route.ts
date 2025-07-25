import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3'

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

function toTitle(str: string) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export async function POST(req: NextRequest) {
  try {
    const overrides = await req.json() // bijv. { "slug": { title: "...", hasGallery: true } }

    // 1. Haal alle rootfolders in de bucket op (één map per download)
    const list = await r2.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME!,
        Delimiter: '/',
      })
    )

    const prefixes = list.CommonPrefixes || []
    const data: Record<string, any> = {}

    for (const prefix of prefixes) {
      const slug = prefix.Prefix!.replace(/\/$/, '')

      const contents = await r2.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME!,
          Prefix: `${slug}/`,
        })
      )

      const files = contents.Contents?.map((obj) => obj.Key!.split('/').pop()!) || []

      const zip = files.find((f) => f.endsWith('.zip'))
      const jpg = files.find((f) => f.toLowerCase().endsWith('.jpg'))

      if (!zip || !jpg) continue

      const subfolders = new Set<string>()
      contents.Contents?.forEach((obj) => {
        const parts = obj.Key!.split('/')
        if (parts.length === 3) subfolders.add(parts[1])
      })

      const hasGallery = subfolders.size > 0
      const title = overrides[slug]?.title || toTitle(slug)
      const finalHasGallery = overrides[slug]?.hasGallery ?? hasGallery

      data[slug] = {
        title,
        downloadUrl: `https://cdn.wouter.photo/${slug}/${zip}`,
        heroImage: `https://cdn.wouter.photo/${slug}/${jpg}`,
        ...(finalHasGallery && { hasGallery: true }),
      }
    }

    // 2. Upload data.json naar root van bucket
    const jsonString = JSON.stringify(data, null, 2)

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME!,
        Key: 'data.json',
        Body: jsonString,
        ContentType: 'application/json',
      })
    )

    return NextResponse.json({ success: true, count: Object.keys(data).length })
  } catch (e) {
    console.error('❌ Fout bij updaten JSON', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}