import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { buildPagination } from '../_lib/paginate'
import { User, UserRole, UserStatus } from '@/types'

// In-memory users store persisted across reloads
const g = globalThis as any
if (!g.__JQS_USERS__) {
  const now = new Date().toISOString()
  const seed: User[] = [
    { id: 1, email: 'alassane.ba.pro@gmail.com', name: 'Admin', roles: [UserRole.ADMIN], lang: 'fr', status: UserStatus.ACTIVE, emailVerified: true, twoFactorEnabled: false, createdAt: now, updatedAt: now, lastLoginAt: now },
  ]
  g.__JQS_USERS__ = { seq: 2, items: seed }
}
const store: { seq: number; items: User[] } = g.__JQS_USERS__

function sanitize(user: User) {
  return user
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')
    const size = searchParams.get('size')
    const q = (searchParams.get('q') || '').toLowerCase().trim()
    const role = searchParams.get('role') as UserRole | null
    const status = searchParams.get('status') as UserStatus | null

    let items = [...store.items]
    if (q) items = items.filter(u => u.email.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q))
    if (role && Object.values(UserRole).includes(role)) items = items.filter(u => u.roles?.includes(role))
    if (status && Object.values(UserStatus).includes(status)) items = items.filter(u => u.status === status)

    const res = buildPagination(items.map(sanitize), page, size)
    return NextResponse.json(res)
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: [], pagination: { page: 1, size: 10, total: 0, totalPages: 0, hasNext: false, hasPrevious: false } }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const body = await req.json().catch(() => ({}))
    const { email, name, roles, lang, status } = body || {}
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ data: null, success: false, message: 'Email requis', timestamp: new Date().toISOString() }, { status: 400 })
    }
    const now = new Date().toISOString()
    const user: User = {
      id: store.seq++,
      email,
      name: typeof name === 'string' ? name : email,
      roles: Array.isArray(roles) && roles.length ? roles.filter((r: any) => Object.values(UserRole).includes(r)) : [UserRole.USER],
      lang: typeof lang === 'string' ? lang : 'fr',
      status: Object.values(UserStatus).includes(status) ? status : UserStatus.ACTIVE,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
    }
    store.items.unshift(user)
    return NextResponse.json({ data: sanitize(user), success: true, message: 'OK', timestamp: now })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur création utilisateur', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
