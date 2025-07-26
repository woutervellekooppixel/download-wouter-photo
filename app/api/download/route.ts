import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const fileUrl = searchParams.get('file')

  if (!fileUrl) {
    return new Response('Missing "file" query parameter', { status: 400 })
  }

  try {
    const res = await fetch(fileUrl)

    if (!res.ok) {
      return new Response('Failed to fetch file', { status: 502 })
    }

    const filename = fileUrl.split('/').pop() || 'download'

    return new Response(res.body, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    return new Response('Internal server error', { status: 500 })
  }
}