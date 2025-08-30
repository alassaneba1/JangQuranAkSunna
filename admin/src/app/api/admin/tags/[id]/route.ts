import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '../../../_lib/session'
import { deleteTag, listTags, updateTag } from '../../../_lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = parseInt(params.id, 10)
    const item = listTags({}).find(t => (t as any).id === id)
    if (!item) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    return NextResponse.json({ data: item, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e:any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur', timestamp: new Date().toISOString() }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = parseInt(params.id, 10)
    const body = await req.json().catch(() => ({}))
    const item = updateTag(id, body || {})
    if (!item) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    return NextResponse.json({ data: item, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e:any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur mise à jour', timestamp: new Date().toISOString() }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req.headers.get('authorization'))
    const id = parseInt(params.id, 10)
    const ok = deleteTag(id)
    if (!ok) return NextResponse.json({ data: null, success: false, message: 'Introuvable', timestamp: new Date().toISOString() }, { status: 404 })
    return NextResponse.json({ data: true, success: true, message: 'Supprimé', timestamp: new Date().toISOString() })
  } catch (e:any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur suppression', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
