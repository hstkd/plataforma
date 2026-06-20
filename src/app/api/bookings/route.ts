import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { createZoomMeeting } from '@/lib/integrations/zoom'
import { BRAND } from '@/lib/brand'

const createSchema = z.object({
  slotId: z.string().min(1),
  focus: z.string().min(3, 'Cuéntanos en qué quieres enfocar la clase'),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }, { status: 400 })
  }

  const slot = await db.slots.byId(parsed.data.slotId)
  if (!slot || slot.booked) {
    return NextResponse.json({ error: 'Ese horario ya no está disponible' }, { status: 409 })
  }

  const booking = await db.bookings.create({
    userId: user.id,
    slotId: parsed.data.slotId,
    focus: parsed.data.focus,
  })
  if (!booking) {
    return NextResponse.json({ error: 'No se pudo crear la reserva' }, { status: 409 })
  }

  // Confirmación automática: generamos la reunión de Zoom.
  try {
    const meeting = await createZoomMeeting({
      topic: `Clase privada · ${user.name} (${BRAND.name})`,
      startTime: slot.startsAt,
      durationMin: slot.durationMin,
      attendeeEmail: user.email,
    })
    await db.bookings.attachZoom(booking.id, {
      joinUrl: meeting.joinUrl,
      meetingId: meeting.meetingId,
    })
  } catch {
    // La reserva queda confirmada aunque Zoom falle; se reintenta luego.
  }

  return NextResponse.json({ ok: true })
}

const cancelSchema = z.object({ bookingId: z.string().min(1) })

export async function DELETE(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const parsed = cancelSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  const ok = await db.bookings.cancel(parsed.data.bookingId, user.id)
  if (!ok) return NextResponse.json({ error: 'No se pudo cancelar' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
