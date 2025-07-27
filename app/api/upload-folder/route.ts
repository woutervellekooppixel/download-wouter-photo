import { NextRequest, NextResponse } from 'next/server'
import { r2 } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const path = formData.get('path') as string

  if (!file || !path) {
    console.error('❌ Bestand of pad ontbreekt')
    return NextResponse.json({ error: 'Bestand of pad ontbreekt' }, { status: 400 })
  }

  console.log('⬆️ Ontvangen voor upload:')
  console.log('- path:', path)
  console.log('- filename:', file.name)
  console.log('- size:', file.size)
  console.log('- type:', file.type)

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `photos/${path}`,
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
  })

  try {
    await r2.send(command)
    console.log(`✅ Succesvol geüpload: ${path}`)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('❌ Fout bij upload naar R2:', err)
    return NextResponse.json({ error: 'Upload naar R2 mislukt' }, { status: 500 })
  }
}