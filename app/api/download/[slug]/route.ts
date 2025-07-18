import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const filePath = path.join(process.cwd(), 'public', 'data.json')
  const jsonData = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(jsonData)

  const download = data[params.slug]
  if (!download || !download.downloadUrl) {
    return NextResponse.redirect('/404')
  }

  return NextResponse.redirect(download.downloadUrl)
}
