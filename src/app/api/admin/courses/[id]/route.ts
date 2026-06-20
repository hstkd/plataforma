import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await params
  const ok = await db.courses.remove(id)
  if (!ok) return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
