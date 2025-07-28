import { NextRequest, NextResponse } from 'next/server'
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

function toTitle(str: string) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export async function POST(req: NextRequest) {
  try {
    let overrides: Record<string, any> = {}
    try {
      overrides = await req.json()
    } catch {
      overrides = {}
    }
    console.log('⬇️ Ontvangen overrides:', overrides)

    // 📁 Eerst: lees alle folders onder /photos/
    const list = await r2.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME!,
        Prefix: 'photos/',
        Delimiter: '/',
      })
    )

    const prefixes = list.CommonPrefixes || []
    console.log('📂 Folders gevonden in photos/:', prefixes.map((p) => p.Prefix))

    const data: Record<string, any> = {}

    for (const prefix of prefixes) {
      const slug = prefix.Prefix!.replace(/^photos\/|\/$/g, '') // haal 'photos/' en trailing slash weg
      console.log(`🔍 Verwerk: ${slug}`)

      const contents = await r2.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET_NAME!,
          Prefix: `photos/${slug}/`,
        })
      )

const filesInMainFolder =
  contents.Contents?.filter((obj) => obj.Key!.split('/').length === 3) || []

const zip = filesInMainFolder
  .map((obj) => obj.Key!.split('/').pop()!)
  .find((f) => f.endsWith('.zip'))

const jpg = filesInMainFolder
  .map((obj) => obj.Key!.split('/').pop()!)
  .find((f) => f.toLowerCase().endsWith('.jpg'))

      if (!zip || !jpg) {
        console.warn(`⛔ Map ${slug} overgeslagen — zip of jpg ontbreekt`)
        continue
      }

      const subfolders = new Set<string>()
      contents.Contents?.forEach((obj) => {
        const parts = obj.Key!.split('/')
        if (parts.length === 4) subfolders.add(parts[2])
      })

      const hasGallery = subfolders.size > 0
      const title = overrides[slug]?.title || toTitle(slug)
      const finalHasGallery = overrides[slug]?.hasGallery ?? hasGallery

      data[slug] = {
        title,
        downloadUrl: `https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/photos/${slug}/${zip}`,
        heroImage: `https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/photos/${slug}/${jpg}`,
        ...(finalHasGallery && { hasGallery: true }),
      }

      console.log(`✅ Toegevoegd: ${slug}`)
    }

    const jsonString = JSON.stringify(data, null, 2)

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME!,
        Key: 'data.json',
        Body: jsonString,
        ContentType: 'application/json',
      })
    )

    console.log('📤 data.json succesvol geüpload met', Object.keys(data).length, 'entries')

    return NextResponse.json({
      success: true,
      count: Object.keys(data).length,
    })
  } catch (e) {
    console.error('❌ Fout in /api/update-json:', e, e?.stack)
    return NextResponse.json(
      { success: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}