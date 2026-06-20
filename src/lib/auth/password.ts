import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

// Hash de contraseñas con scrypt (formato "salt:hash"). Suficiente para el
// entorno demo y trivialmente reemplazable por bcrypt/argon2 en producción.

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = scryptSync(password, salt, 64)
  const hashBuf = Buffer.from(hash, 'hex')
  return hashBuf.length === derived.length && timingSafeEqual(hashBuf, derived)
}
