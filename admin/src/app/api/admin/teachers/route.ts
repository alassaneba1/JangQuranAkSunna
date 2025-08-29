import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { buildPagination } from '../_lib/paginate'

const TEACHERS: any[] = (globalThis as any).__TEACHERS__ || [
  {
    id: 1,
    displayName: 'Imam Mansour Diop',
    languages: ['fr', 'wo'],
    verified: true,
    status: 'VERIFIED',
    user: { id: 101, name: 'Mansour Diop' },
  },
  {
    id: 2,
    displayName: 'Cheikh Ahmed Ba',
    languages: ['ar', 'fr'],
    verified: false,
    status: 'PENDING',
    user: { id: 102, name: 'Ahmed Ba' },
  },
]
;(globalThis as any).__TEACHERS__ = TEACHERS
let NEXT_ID = (globalThis as any).__TEACHERS_NEXT_ID__ || 3
;(globalThis as any).__TEACHERS_NEXT_ID__ = NEXT_ID

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const res = buildPagination(TEACHERS, page, size)
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
    const item = { id: NEXT_ID++, displayName: body.displayName, languages: body.languages || [], verified: !!body.verified, status: body.status || 'PENDING', user: body.user || null }
    TEACHERS.push(item)
    ;(globalThis as any).__TEACHERS_NEXT_ID__ = NEXT_ID
    return NextResponse.json({ data: item, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
