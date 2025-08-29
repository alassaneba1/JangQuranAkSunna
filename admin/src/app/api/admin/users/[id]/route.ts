import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../_lib/session'

const USERS: any[] = (globalThis as any).__USERS__ || [{ id: 1, email: 'alassane.ba.pro@gmail.com', name: 'Admin', roles: ['ADMIN'], lang: 'fr', status: 'ACTIVE' }]
;(globalThis as any).__USERS__ = USERS

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const found = USERS.find(u => u.id === id)
    if (!found) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    return NextResponse.json({ data: found, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: null, success: false, message: 'Unauthorized', timestamp: new Date().toISOString() }, { status })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const idx = USERS.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    const body = await req.json()
    USERS[idx] = { ...USERS[idx], ...body, id }
    return NextResponse.json({ data: USERS[idx], success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const idx = USERS.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    USERS.splice(idx, 1)
    return NextResponse.json({ data: { ok: true }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
