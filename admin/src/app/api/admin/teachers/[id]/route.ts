import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../_lib/session'

const TEACHERS: any[] = (globalThis as any).__TEACHERS__ || [
  { id: 1, displayName: 'Imam Mansour Diop', languages: ['fr', 'wo'], verified: true, status: 'VERIFIED', user: { id: 101, name: 'Mansour Diop' } },
  { id: 2, displayName: 'Cheikh Ahmed Ba', languages: ['ar', 'fr'], verified: false, status: 'PENDING', user: { id: 102, name: 'Ahmed Ba' } },
]
;(globalThis as any).__TEACHERS__ = TEACHERS

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const found = TEACHERS.find(u => u.id === id)
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
    const idx = TEACHERS.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    const body = await req.json()
    TEACHERS[idx] = { ...TEACHERS[idx], ...body, id }
    return NextResponse.json({ data: TEACHERS[idx], success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const idx = TEACHERS.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    TEACHERS.splice(idx, 1)
    return NextResponse.json({ data: { ok: true }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
