import { r2 } from '@/lib/r2'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function POST(req: NextRequest) {
  const { fileName, contentType } = await req.json()

  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'Bestandsnaam of content-type ontbreekt' }, { status: 400 })
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `photos/${fileName}`,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 60 })

  return NextResponse.json({ signedUrl })
}