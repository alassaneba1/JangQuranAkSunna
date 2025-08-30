import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../../../_lib/session'
import { getContent, updateContent } from '../../_lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const c = getContent(id)
    if (!c) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: c, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const body = await req.json().catch(() => ({}))
    const updated = updateContent(id, body)
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: updated, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
