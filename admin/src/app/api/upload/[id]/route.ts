import { NextRequest } from 'next/server'
import { getFile } from '../../_lib/uploads'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const f = getFile(params.id)
  if (!f) return new Response('Not found', { status: 404 })
  return new Response(f.buffer, {
    status: 200,
    headers: {
      'Content-Type': f.mime,
      'Content-Length': String(f.size),
      'Cache-Control': 'no-store',
      'Content-Disposition': `inline; filename="${encodeURIComponent(f.filename)}"`
    }
  })
}
