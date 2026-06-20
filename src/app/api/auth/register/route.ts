import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth/session'

const schema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
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

  const existing = await db.users.findByEmail(parsed.data.email)
  if (existing) {
    return NextResponse.json({ error: 'Ese email ya está registrado' }, { status: 409 })
  }

  const user = await db.users.create(parsed.data)
  await createSession(user.id)

  return NextResponse.json({ ok: true, redirect: '/dashboard' })
}
