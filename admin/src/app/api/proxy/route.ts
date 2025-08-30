import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return new Response('Missing url', { status: 400 })
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new Response('Invalid protocol', { status: 400 })
    }
    // Basic allowlist: only proxy common file types
    const allowed = /(\.pdf|\.mp4|\.mp3|\.m3u8|\.webm|\.ogg|\.wav)(\?.*)?$/i
    if (!allowed.test(parsed.pathname)) {
      return new Response('File type not allowed', { status: 400 })
    }

    const upstream = await fetch(parsed.toString(), { cache: 'no-store' })
    if (!upstream.ok) {
      return new Response(`Upstream error ${upstream.status}`, { status: 502 })
    }

    const headers = new Headers(upstream.headers)
    headers.set('X-Frame-Options', 'SAMEORIGIN')
    headers.delete('Content-Security-Policy')
    headers.set('Cache-Control', 'public, max-age=300')

    return new Response(upstream.body, { status: 200, headers })
  } catch (e) {
    return new Response('Proxy error', { status: 500 })
  }
}
