import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 },
    )
  }

  const user = await db.users.findByEmail(parsed.data.email)
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  await createSession(user.id)
  const redirect = user.role === 'ADMIN' ? '/admin' : '/dashboard'
  return NextResponse.json({ ok: true, redirect })
}
