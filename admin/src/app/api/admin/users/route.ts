import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { buildPagination } from '../_lib/paginate'

const USERS: any[] = [
  { id: 1, email: 'alassane.ba.pro@gmail.com', name: 'Admin', roles: ['ADMIN'], lang: 'fr', status: 'ACTIVE' },
]
let NEXT_ID = 2

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const res = buildPagination(USERS, page, size)
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
    const user = { id: NEXT_ID++, email: body.email, name: body.name || body.email, roles: body.roles || ['USER'], lang: body.lang || 'fr', status: 'ACTIVE' }
    USERS.push(user)
    return NextResponse.json({ data: user, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
