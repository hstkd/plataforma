import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'

const schema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto').optional(),
  avatarUrl: z.string().url('URL inválida').optional(),
})

export async function PATCH(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }, { status: 400 })
  }

  await db.users.update(user.id, parsed.data)
  return NextResponse.json({ ok: true })
}
