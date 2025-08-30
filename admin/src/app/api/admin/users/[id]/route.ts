import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../../../_lib/session'
import { User, UserRole, UserStatus } from '@/types'

const g = globalThis as any
if (!g.__JQS_USERS__) {
  g.__JQS_USERS__ = { seq: 1, items: [] as User[] }
}
const store: { seq: number; items: User[] } = g.__JQS_USERS__

function findUser(id: number) {
  return store.items.find(u => u.id === id) || null
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const user = findUser(id)
    if (!user) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    return NextResponse.json({ data: user, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const idx = store.items.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    const body = await req.json().catch(() => ({}))
    const u = store.items[idx]
    const now = new Date().toISOString()
    const next: User = {
      ...u,
      name: typeof body.name === 'string' ? body.name : u.name,
      roles: Array.isArray(body.roles) ? body.roles.filter((r: any) => Object.values(UserRole).includes(r)) : u.roles,
      lang: typeof body.lang === 'string' ? body.lang : u.lang,
      status: Object.values(UserStatus).includes(body.status) ? body.status : u.status,
      emailVerified: typeof body.emailVerified === 'boolean' ? body.emailVerified : u.emailVerified,
      twoFactorEnabled: typeof body.twoFactorEnabled === 'boolean' ? body.twoFactorEnabled : u.twoFactorEnabled,
      updatedAt: now,
    }
    store.items[idx] = next
    return NextResponse.json({ data: next, success: true, message: 'OK', timestamp: now })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur mise à jour', timestamp: new Date().toISOString() }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const before = store.items.length
    store.items = store.items.filter(u => u.id !== id)
    if (store.items.length === before) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    return NextResponse.json({ data: true, success: true, message: 'Supprimé', timestamp: new Date().toISOString() })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur suppression', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
