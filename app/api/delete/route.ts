import { NextResponse } from 'next/server'
import { listObjects, deleteFolder, uploadJson, getJson } from '@/lib/r2-utils'

export async function POST(req: Request) {
  const downloads = await getJson('data.json')

  if (!slug) {
    return NextResponse.json({ success: false, error: 'Slug ontbreekt' }, { status: 400 })
  }

  try {
    // Haal huidige JSON op
    const downloads = await getJson()

    // Verwijder entry uit JSON
    delete downloads[slug]

    // Upload aangepaste JSON
    await uploadJson(downloads)

    // Verwijder map in R2
    await deleteFolder(`photos/${slug}/`)
    await deleteFolder(`files/${slug}/`) // fallback

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}