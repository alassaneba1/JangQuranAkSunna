import { randomBytes } from 'crypto'

export type SessionUser = {
  id: number
  email: string
  name: string
  roles: string[]
  lang?: string
  status?: string
}

const sessions = new Map<string, SessionUser>()

export function createToken(user: SessionUser, remember = false) {
  const token = randomBytes(32).toString('hex')
  sessions.set(token, user)
  return { token, user }
}

export function getUserFromAuthHeader(authorization?: string | null): SessionUser | null {
  if (!authorization) return null
  const [scheme, token] = authorization.split(' ')
  if (!token || scheme !== 'Bearer') return null
  return sessions.get(token) || null
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
