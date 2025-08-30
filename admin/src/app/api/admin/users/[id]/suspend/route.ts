import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../../../../_lib/session'
import { User, UserStatus } from '@/types'

const g = globalThis as any
if (!g.__JQS_USERS__) {
  g.__JQS_USERS__ = { seq: 1, items: [] as User[] }
}
const store: { seq: number; items: User[] } = g.__JQS_USERS__

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const idx = store.items.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    const now = new Date().toISOString()
    store.items[idx] = { ...store.items[idx], status: UserStatus.SUSPENDED, updatedAt: now }
    return NextResponse.json({ data: store.items[idx], success: true, message: 'Suspendu', timestamp: now })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur suspension', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
