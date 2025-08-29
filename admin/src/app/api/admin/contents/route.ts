import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { buildPagination } from '../_lib/paginate'

const CONTENTS: any[] = [
  { id: 1, title: 'Tafsir Sourate Al-Fatiha', type: 'AUDIO', lang: 'fr', viewsCount: 1240 },
  { id: 2, title: 'Introduction au Fiqh Maliki', type: 'VIDEO', lang: 'wo', viewsCount: 860 },
]

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const res = buildPagination(CONTENTS, page, size)
    return NextResponse.json(res)
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: [], pagination: { page: 1, size: 10, total: 0, totalPages: 0, hasNext: false, hasPrevious: false } }, { status })
  }
}
