import 'server-only'

// =====================================================================
// Integración de pagos — Stripe (scaffold).
// Si STRIPE_SECRET_KEY no está definida, corre en MODO SIMULADO: genera
// una "sesión de checkout" local que el flujo de la app puede completar
// sin cobrar nada. Cuando agregues las claves reales:
//   1. npm i stripe
//   2. Descomenta la implementación real marcada con TODO.
//   3. Configura el webhook en /api/webhooks/stripe.
// =====================================================================

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY)

export interface CheckoutInput {
  userId: string
  type: 'COURSE' | 'PRIVATE_CLASS' | 'MEMBERSHIP'
  amountCents: number
  label: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export interface CheckoutResult {
  url: string
  simulated: boolean
  sessionId: string
}

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
  if (!stripeEnabled) {
    // MODO SIMULADO: devolvemos una URL interna que confirma el pago.
    const sessionId = `sim_${Date.now().toString(36)}`
    const params = new URLSearchParams({
      simulated: '1',
      type: input.type,
      amount: String(input.amountCents),
      ...input.metadata,
    })
    return {
      url: `${input.successUrl}?${params.toString()}`,
      simulated: true,
      sessionId,
    }
  }

  // TODO (producción): implementación real con Stripe.
  // const Stripe = (await import('stripe')).default
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const session = await stripe.checkout.sessions.create({
  //   mode: input.type === 'MEMBERSHIP' ? 'subscription' : 'payment',
  //   line_items: [...],
  //   success_url: input.successUrl,
  //   cancel_url: input.cancelUrl,
  //   metadata: { userId: input.userId, type: input.type, ...input.metadata },
  // })
  // return { url: session.url!, simulated: false, sessionId: session.id }
  throw new Error('Stripe configurado pero la implementación real no está habilitada todavía.')
}
