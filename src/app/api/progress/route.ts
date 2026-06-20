import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'

const schema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  await db.progress.setComplete(user.id, parsed.data.lessonId, parsed.data.completed)
  const fresh = await db.users.findById(user.id)

  return NextResponse.json({ ok: true, xp: fresh?.xp ?? user.xp })
}
