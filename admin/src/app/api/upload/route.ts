import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../_lib/session'
import { saveFile, buildUrl } from '../_lib/uploads'

export async function POST(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, message: 'file requis' }, { status: 400 })
    const arrayBuf = await file.arrayBuffer()
    const buf = Buffer.from(arrayBuf)
    const saved = saveFile(buf, file.type || 'application/octet-stream', (file as any).name || 'upload')
    const url = buildUrl(saved.id)
    return NextResponse.json({ data: { id: saved.id, url, filename: saved.filename, mime: saved.mime, size: saved.size }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur upload', timestamp: new Date().toISOString() }, { status })
  }
}
