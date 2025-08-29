import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../_lib/session'

const CONTENTS: any[] = (globalThis as any).__CONTENTS__ || [
  { id: 1, title: 'Tafsir Sourate Al-Fatiha', type: 'AUDIO', lang: 'fr', viewsCount: 1240 },
  { id: 2, title: 'Introduction au Fiqh Maliki', type: 'VIDEO', lang: 'wo', viewsCount: 860 },
]
;(globalThis as any).__CONTENTS__ = CONTENTS

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const found = CONTENTS.find(u => u.id === id)
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
    const idx = CONTENTS.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    const body = await req.json()
    CONTENTS[idx] = { ...CONTENTS[idx], ...body, id }
    return NextResponse.json({ data: CONTENTS[idx], success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = Number(params.id)
    const idx = CONTENTS.findIndex(u => u.id === id)
    if (idx === -1) return NextResponse.json({ data: null, success: false, message: 'Not found', timestamp: new Date().toISOString() }, { status: 404 })
    CONTENTS.splice(idx, 1)
    return NextResponse.json({ data: { ok: true }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 400
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
