import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { buildPagination } from '../_lib/paginate'

const CONTENTS: any[] = (globalThis as any).__CONTENTS__ || [
  { id: 1, title: 'Tafsir Sourate Al-Fatiha', type: 'AUDIO', lang: 'fr', viewsCount: 1240, mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Introduction au Fiqh Maliki', type: 'VIDEO', lang: 'wo', viewsCount: 860, mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
]
;(globalThis as any).__CONTENTS__ = CONTENTS
let NEXT_ID = (globalThis as any).__CONTENTS_NEXT_ID__ || 3
;(globalThis as any).__CONTENTS_NEXT_ID__ = NEXT_ID

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const q = (searchParams.get('q') || '').toLowerCase()
    const type = searchParams.get('type') || ''
    const lang = searchParams.get('lang') || ''
    const filtered = CONTENTS.filter((c) => {
      if (q && !(c.title?.toLowerCase().includes(q))) return false
      if (type && c.type !== type) return false
      if (lang && c.lang !== lang) return false
      return true
    })
    const res = buildPagination(filtered, page, size)
    return NextResponse.json(res)
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: [], pagination: { page: 1, size: 10, total: 0, totalPages: 0, hasNext: false, hasPrevious: false } }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const body = await req.json()
    const item = { id: NEXT_ID++, title: body.title, type: body.type || 'AUDIO', lang: body.lang || 'fr', viewsCount: body.viewsCount || 0, mediaUrl: body.mediaUrl || '' }
    CONTENTS.push(item)
    ;(globalThis as any).__CONTENTS_NEXT_ID__ = NEXT_ID
    return NextResponse.json({ data: item, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
