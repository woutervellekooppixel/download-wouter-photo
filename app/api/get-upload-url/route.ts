// app/api/get-upload-url/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType } = await req.json()

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName of contentType ontbreekt' }, { status: 400 })
    }

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `photos/${fileName}`,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 60 })

    console.log('🖊️ Signed URL gegenereerd voor:', fileName)

    return NextResponse.json({ signedUrl })
  } catch (error: any) {
    console.error('❌ Fout bij genereren signed URL:', error)
    return NextResponse.json({ error: 'Fout bij upload URL genereren' }, { status: 500 })
  }
}