import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { db } from '@/lib/db'
import type { PublicUser } from '@/lib/types'

const COOKIE = 'hstkd_session'
const ALG = 'HS256'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 días

function secret() {
  const s = process.env.AUTH_SECRET || 'dev-secret-change-me-in-production-please-32chars'
  return new TextEncoder().encode(s)
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())

  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function destroySession() {
  const store = await cookies()
  store.delete(COOKIE)
}

/** Devuelve el usuario autenticado (sin passwordHash) o null. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    const userId = payload.sub
    if (!userId) return null
    const user = await db.users.findById(userId)
    if (!user) return null
    const { passwordHash: _omit, ...safe } = user
    return safe
  } catch {
    return null
  }
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}
