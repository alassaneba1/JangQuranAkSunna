import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../_lib/session'
import { listContents, listTeachers } from '../../admin/_lib/db'

export async function GET(req: NextRequest) {
  try {
    requireAuth(req.headers.get('authorization'))
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const limit = Math.max(1, Math.min(5, parseInt(searchParams.get('limit') || '5', 10)))
    const contents = listContents({ page: 1, size: 100, q, type: null, lang: null }).data
    const teachers = listTeachers({ page: 1, size: 100, q, verified: null, lang: null }).data
    const contentTitles = Array.from(new Set(contents.map((c:any)=>c.title))).slice(0, limit)
    const teacherNames = Array.from(new Set(teachers.map((t:any)=>t.displayName || t.user?.name))).slice(0, limit)
    return NextResponse.json({ data: { contentTitles, teacherNames }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    const status = e?.status || 401
    return NextResponse.json({ data: { contentTitles: [], teacherNames: [] }, success: false, message: 'Unauthorized', timestamp: new Date().toISOString() }, { status })
  }
}
