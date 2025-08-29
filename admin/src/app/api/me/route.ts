import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../_lib/session'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    const user = requireAuth(auth)
    return NextResponse.json({ data: { id: user.id, email: user.email, name: user.name, roles: user.roles, lang: user.lang, status: user.status }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: null, success: false, message: 'Non autorisé', timestamp: new Date().toISOString() }, { status })
  }
}
