import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { createMosque, listMosques } from '../_lib/db'

export async function GET(req: NextRequest) {
  try {
    requireAuthFromRequest(req)
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const size = Math.max(1, Math.min(100, parseInt(searchParams.get('size') || '10', 10)))
    const q = searchParams.get('q')
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const res = listMosques({ page, size, q, city, country })
    return NextResponse.json(res)
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: [], pagination: { page: 1, size: 10, total: 0, totalPages: 0, hasNext: false, hasPrevious: false } }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuthFromRequest(req)
    const body = await req.json().catch(() => ({}))
    const created = createMosque(body)
    return NextResponse.json({ data: created, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
