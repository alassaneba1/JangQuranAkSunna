import { NextRequest, NextResponse } from 'next/server'
import { createToken } from '../../_lib/session'

const ADMIN_EMAIL = 'alassane.ba.pro@gmail.com'
const ADMIN_PASSWORD = 'Baalsane12@'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password, rememberMe } = body || {}
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ data: null, success: false, message: 'Email et mot de passe requis', timestamp: new Date().toISOString() }, { status: 400 })
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ data: null, success: false, message: 'Identifiants invalides', timestamp: new Date().toISOString() }, { status: 401 })
    }

    const user = { id: 1, email: ADMIN_EMAIL, name: 'Admin', roles: ['ADMIN'], lang: 'fr', status: 'ACTIVE' }
    const { token } = createToken(user, !!rememberMe)

    const res = NextResponse.json({ data: { token }, success: true, message: 'OK', timestamp: new Date().toISOString() })
    // Set httpOnly cookie so fetch/API calls work without manual header
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false,
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ data: null, success: false, message: 'Erreur de connexion', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
