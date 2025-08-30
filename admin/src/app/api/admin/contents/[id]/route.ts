import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../_lib/session'
import { getContent } from '../../_lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = parseInt(params.id, 10)
    const c = getContent(id)
    if (!c) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: c, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status })
  }
}
