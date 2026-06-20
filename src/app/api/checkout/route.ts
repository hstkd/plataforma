import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { createCheckoutSession } from '@/lib/payments/stripe'

const schema = z.object({
  type: z.enum(['COURSE', 'PRIVATE_CLASS', 'MEMBERSHIP']),
  courseId: z.string().optional(),
  planId: z.string().optional(),
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  const { type, courseId, planId } = parsed.data

  // Resolver monto y etiqueta según el tipo de compra.
  let amountCents = 0
  let label = ''
  let successUrl = `${APP_URL}/dashboard`

  if (type === 'COURSE') {
    const course = courseId ? await db.courses.byId(courseId) : null
    if (!course) return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    amountCents = course.priceCents
    label = course.title
    successUrl = `${APP_URL}/dashboard/biblioteca/${course.slug}`
  } else if (type === 'MEMBERSHIP') {
    const plan = planId ? await db.plans.byId(planId) : null
    if (!plan) return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    amountCents = plan.priceCents
    label = `Membresía ${plan.name}`
    successUrl = `${APP_URL}/dashboard/membresia`
  }

  const session = await createCheckoutSession({
    userId: user.id,
    type,
    amountCents,
    label,
    successUrl,
    cancelUrl: `${APP_URL}/dashboard/membresia`,
    metadata: { courseId: courseId ?? '', planId: planId ?? '' },
  })

  // ----------------------------------------------------------------
  // MODO SIMULADO: como no hay webhook de Stripe, registramos la orden
  // y activamos el acceso de inmediato. En producción esto ocurre en el
  // webhook /api/webhooks/stripe tras el evento checkout.session.completed.
  // ----------------------------------------------------------------
  if (session.simulated) {
    await db.orders.create({
      userId: user.id,
      type,
      status: 'PAID',
      amountCents,
      currency: 'usd',
      courseId: type === 'COURSE' ? courseId : undefined,
    })
    if (type === 'MEMBERSHIP' && planId) {
      await db.memberships.upsert(user.id, planId)
    }
  }

  return NextResponse.json({ ok: true, url: session.url, simulated: session.simulated })
}
