import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ data: true, success: true, message: 'Déconnecté', timestamp: new Date().toISOString() })
  res.cookies.set('auth_token', '', { httpOnly: true, sameSite: 'lax', path: '/', secure: false, maxAge: 0 })
  return res
}
