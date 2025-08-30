import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../../_lib/session'
import { createTheme, listThemes } from '../../_lib/db'

export async function GET(req: NextRequest) {
  try {
    requireAuthFromRequest(req)
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const items = listThemes({ q })
    return NextResponse.json({ data: items, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: [], success: false, message: 'Non autorisé', timestamp: new Date().toISOString() }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuthFromRequest(req)
    const body = await req.json().catch(() => ({}))
    const item = createTheme(body || {})
    return NextResponse.json({ data: item, success: true, message: 'Créé', timestamp: new Date().toISOString() })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
