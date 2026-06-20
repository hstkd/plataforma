import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// =====================================================================
// Webhook de Stripe (scaffold). En producción Stripe llama aquí tras un
// pago. Hay que verificar la firma con STRIPE_WEBHOOK_SECRET y luego
// activar el acceso correspondiente. En modo demo el acceso se activa
// directamente en /api/checkout, así que este endpoint solo deja la
// estructura lista.
// =====================================================================

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { received: true, note: 'Webhook en modo demo: no hay firma que verificar.' },
      { status: 200 },
    )
  }

  // TODO (producción):
  // const sig = req.headers.get('stripe-signature')!
  // const body = await req.text()
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  // switch (event.type) {
  //   case 'checkout.session.completed': {
  //     const s = event.data.object
  //     const { userId, type, courseId, planId } = s.metadata
  //     await db.orders.create({ userId, type, status: 'PAID', amountCents: s.amount_total, currency: s.currency })
  //     if (type === 'MEMBERSHIP' && planId) await db.memberships.upsert(userId, planId)
  //     break
  //   }
  // }

  void db // referencia para producción
  return NextResponse.json({ received: true })
}
