import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ data: null, success: false, message: 'Fichier manquant', timestamp: new Date().toISOString() }, { status: 400 })
    }
    const fakeUrl = `/uploads/${Date.now()}-${file.name}`
    return NextResponse.json({ data: { url: fakeUrl, name: file.name, size: file.size, type: file.type }, success: true, message: 'OK', timestamp: new Date().toISOString() })
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur upload', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
