import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../../_lib/session'
import { listTeachers } from '../_lib/db'

export async function GET(req: NextRequest) {
  try {
    requireAuthFromRequest(req)
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const size = Math.max(1, Math.min(100, parseInt(searchParams.get('size') || '10', 10)))
    const q = searchParams.get('q')
    const verified = searchParams.get('verified')
    const lang = searchParams.get('lang')
    const res = listTeachers({ page, size, q, verified, lang: lang as any })
    return NextResponse.json(res)
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: [], pagination: { page: 1, size: 10, total: 0, totalPages: 0, hasNext: false, hasPrevious: false } }, { status })
  }
}
