import { NextRequest, NextResponse } from 'next/server'
import { requireAuthFromRequest } from '../_lib/session'
import { listContents, listTeachers } from '../admin/_lib/db'

export async function GET(req: NextRequest) {
  try {
    requireAuthFromRequest(req)
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const limit = Math.max(1, Math.min(20, parseInt(searchParams.get('limit') || '10', 10)))
    const contents = listContents({ page: 1, size: limit, q, type: null, lang: null }).data
    const teachers = listTeachers({ page: 1, size: limit, q, verified: null }).data
    return NextResponse.json({ data: { contents, teachers }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: { contents: [], teachers: [] }, success: false, message: 'Unauthorized', timestamp: new Date().toISOString() }, { status })
  }
}
