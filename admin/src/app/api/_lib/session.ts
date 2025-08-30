import { createHmac } from 'crypto'

export type SessionUser = {
  id: number
  email: string
  name: string
  roles: string[]
  lang?: string
  status?: string
}

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(String(input))
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function signHS256(data: string, secret: string) {
  return base64url(createHmac('sha256', secret).update(data).digest())
}

function getSecret() {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'dev-secret'
}

export function createToken(user: SessionUser, remember = false) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24)
  const payload = { sub: String(user.id), iat, exp, user }
  const encHeader = base64url(JSON.stringify(header))
  const encPayload = base64url(JSON.stringify(payload))
  const signature = signHS256(`${encHeader}.${encPayload}`, getSecret())
  const token = `${encHeader}.${encPayload}.${signature}`
  return { token, user }
}

export function getUserFromAuthHeader(authorization?: string | null): SessionUser | null {
  if (!authorization) return null
  const [scheme, token] = authorization.split(' ')
  if (!token || scheme !== 'Bearer') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [encHeader, encPayload, signature] = parts
  const expected = signHS256(`${encHeader}.${encPayload}`, getSecret())
  if (expected !== signature) return null
  try {
    const payload = JSON.parse(Buffer.from(encPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    if (typeof payload.exp === 'number' && Math.floor(Date.now() / 1000) > payload.exp) return null
    return payload.user as SessionUser
  } catch {
    return null
  }
}

export function requireAuth(authorization?: string | null): SessionUser {
  const user = getUserFromAuthHeader(authorization)
  if (!user) {
    const err: any = new Error('Unauthorized')
    err.status = 401
    throw err
  }
  return user
}

// Helper to extract auth from NextRequest headers or cookies
import type { NextRequest } from 'next/server'
export function requireAuthFromRequest(req: NextRequest): SessionUser {
  const header = req.headers.get('authorization')
  // Try cookie fallback
  const cookie = (req as any).cookies?.get?.('auth_token')?.value || null
  const auth = header || (cookie ? `Bearer ${cookie}` : null)
  return requireAuth(auth)
}
