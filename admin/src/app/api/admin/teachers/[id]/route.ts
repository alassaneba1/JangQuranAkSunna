import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../../../_lib/session'
import { updateTeacher } from '../../_lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const body = await req.json().catch(() => ({}))
    const id = parseInt(params.id, 10)
    const updated = updateTeacher(id, body)
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: updated, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}

export const PUT = PATCH

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuthFromRequest(req)
    const id = parseInt(params.id, 10)
    const res = updateTeacher(id, { status: 'INACTIVE' as any })
    if (!res) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: true, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
