import { NextResponse } from 'next/server'

export async function GET() {
  const JSON_URL = 'https://pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev/data.json'

  try {
    const res = await fetch(JSON_URL, {
      cache: 'no-store', // ✅ zorgt dat het nooit gecachet wordt
    })
    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch JSON' }),
      { status: 500 }
    )
  }
}