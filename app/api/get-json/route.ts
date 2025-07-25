import { NextResponse } from 'next/server'

export async function GET() {
  const JSON_URL = 'https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/data.json'

  try {
    const res = await fetch(JSON_URL, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch JSON' }, { status: 500 })
  }
}