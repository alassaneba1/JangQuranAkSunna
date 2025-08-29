import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ data: { ok: true }, success: true, message: 'OK', timestamp: new Date().toISOString() })
}
