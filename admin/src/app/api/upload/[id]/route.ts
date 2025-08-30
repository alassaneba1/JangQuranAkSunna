import { NextRequest } from 'next/server'
import { getFile } from '../../_lib/uploads'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const file = await getFile(params.id)
  if (!file) return new Response('Not found', { status: 404 })
  return new Response(file.buffer, {
    status: 200,
    headers: {
      'Content-Type': file.meta.mime,
      'Content-Length': String(file.buffer.byteLength),
      'Cache-Control': 'no-store',
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.meta.filename)}"`
    }
  })
}
