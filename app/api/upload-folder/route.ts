import { NextRequest, NextResponse } from 'next/server'
import { r2 } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'


export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const path = formData.get('path') as string

  if (!file || !path) {
    return NextResponse.json({ error: 'Bestand of pad ontbreekt' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `photos/${path}`, // 👈 alles gaat naar photos/
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
  })

  await r2.send(command)

  return NextResponse.json({ success: true })
}