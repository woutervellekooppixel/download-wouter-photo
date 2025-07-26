import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  const { slug } = await req.json()

  // 🔁 Eerst: trigger /api/update-json (die herbouwt data.json)
  const updateRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  })

  // 🔁 Daarna: trigger /api/generate-gallery (voor gallery.json)
  const galleryRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  })

  const updateJson = await updateRes.json()
  const galleryJson = await galleryRes.json()

  return NextResponse.json({
    success: updateRes.ok && galleryRes.ok,
    dataUpdated: updateJson,
    galleryUpdated: galleryJson,
  })
}