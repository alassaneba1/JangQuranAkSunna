import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { buildPagination } from '../_lib/paginate'

const MOSQUES: any[] = (globalThis as any).__MOSQUES__ || [
  { id: 1, name: 'Grande Mosquée de Dakar', city: 'Dakar', country: 'Sénégal' },
  { id: 2, name: 'Mosquée Al-Falah', city: 'Thiaroye', country: 'Sénégal' },
]
;(globalThis as any).__MOSQUES__ = MOSQUES
let NEXT_ID = (globalThis as any).__MOSQUES_NEXT_ID__ || 3
;(globalThis as any).__MOSQUES_NEXT_ID__ = NEXT_ID

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const res = buildPagination(MOSQUES, page, size)
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
    const item = { id: NEXT_ID++, name: body.name, city: body.city || '', country: body.country || '' }
    MOSQUES.push(item)
    ;(globalThis as any).__MOSQUES_NEXT_ID__ = NEXT_ID
    return NextResponse.json({ data: item, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
