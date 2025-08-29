import { NextRequest, NextResponse } from 'next/server'
import { getUserFromAuthHeader } from '../../_lib/session'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const user = getUserFromAuthHeader(auth)
  if (!user) return NextResponse.json({ data: null, success: false, message: 'Unauthorized', timestamp: new Date().toISOString() }, { status: 401 })
  return NextResponse.json({ data: { ok: true }, success: true, message: 'OK', timestamp: new Date().toISOString() })
}
