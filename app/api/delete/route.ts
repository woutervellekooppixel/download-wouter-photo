import { NextResponse } from 'next/server'
import { deleteFolder, uploadJson, getJson } from '@/lib/r2-utils'

export async function POST(req: Request) {
  try {
    // 👉 Haal de slug uit het request body
    const { slug } = await req.json()

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug ontbreekt' }, { status: 400 })
    }

    // 👉 Haal huidige data.json op
    const downloads = await getJson('data.json')

    // 👉 Verwijder de entry
    delete downloads[slug]

    // 👉 Upload de aangepaste JSON terug naar R2
    await uploadJson(downloads)

    // 👉 Verwijder de map in zowel /photos als /files (fallback)
    await deleteFolder(`photos/${slug}/`)
    await deleteFolder(`files/${slug}/`)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}