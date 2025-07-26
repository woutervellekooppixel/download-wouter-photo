import { NextRequest, NextResponse } from 'next/server'
import {
  S3Client,
  ListObjectsV2Command,
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

function formatSectionName(folder: string) {
  return folder.replace(/_/g, ' ')
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  try {
    const prefix = `photos/${slug}/`
    const list = await r2.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME!,
        Prefix: prefix,
      })
    )

    const result: Record<string, string[]> = {}

    for (const obj of list.Contents || []) {
      const key = obj.Key!
      const parts = key.split('/')

      // Alleen verwerken als: photos/slug/section/image.jpg
      if (parts.length === 4 && parts[3].toLowerCase().endsWith('.jpg')) {
        const section = formatSectionName(parts[2])
        const url = `https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/photos/${slug}/${parts[2]}/${parts[3]}`

        if (!result[section]) result[section] = []
        result[section].push(url)
      }
    }

    return NextResponse.json(result)
  } catch (e) {
    console.error('❌ Fout in gallery API:', e)
    return NextResponse.json({ error: 'Fout bij ophalen gallery' }, { status: 500 })
  }
}