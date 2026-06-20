import type { Metadata } from 'next'
import { Check, Crown, Receipt } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/app/PageHeader'
import { CheckoutButton } from '@/components/content/CheckoutButton'
import { formatPrice, cn } from '@/lib/utils'
import { formatDate } from '@/lib/datetime'

export const metadata: Metadata = { title: 'Membresía' }

const ORDER_LABELS: Record<string, string> = {
  MEMBERSHIP: 'Membresía',
  COURSE: 'Curso',
  PRIVATE_CLASS: 'Clase privada',
}

export default async function MembresiaPage() {
  const user = await requireUser()
  const [plans, membership, orders] = await Promise.all([
    db.plans.all(),
    db.memberships.forUser(user.id),
    db.orders.forUser(user.id),
  ])
  const currentPlan = membership ? await db.plans.byId(membership.planId) : null
  const isActive = membership?.status === 'ACTIVE' && new Date(membership.currentPeriodEnd) > new Date()

  return (
    <div>
      <PageHeader
        eyebrow="Membresía y pagos"
        title="Tu plan"
        description="Gestiona tu membresía, mejora de plan y revisa tu historial de compras."
      />

      {/* Estado actual */}
      <div className={cn('card mb-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between', isActive && 'border-gold/40')}>
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold">
            <Crown className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm text-bone-muted">Plan actual</p>
            <p className="font-heading text-xl font-bold text-bone">
              {isActive && currentPlan ? currentPlan.name : 'Cinturón Blanco (gratis)'}
            </p>
            {isActive && membership && (
              <p className="text-xs text-bone-faint">Renueva el {formatDate(membership.currentPeriodEnd)}</p>
            )}
          </div>
        </div>
        <span className={cn('chip', isActive ? 'border-green-500/40 text-green-300' : '')}>
          {isActive ? '● Activa' : 'Sin membresía'}
        </span>
      </div>

      {/* Planes */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan?.id === plan.id && isActive
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-3xl border p-7',
                plan.highlighted ? 'border-gold/60 bg-gradient-to-b from-gold/10 to-ink-card' : 'border-ink-line bg-ink-card',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase text-ink">
                  Recomendado
                </span>
              )}
              <h3 className="font-display text-xl font-bold uppercase text-bone">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-extrabold text-bone">
                  {plan.priceCents === 0 ? 'Gratis' : formatPrice(plan.priceCents)}
                </span>
                {plan.priceCents > 0 && <span className="text-bone-muted">/mes</span>}
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-bone-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {isCurrent ? (
                  <span className="btn w-full border border-green-500/40 bg-green-500/10 text-green-300">Tu plan actual</span>
                ) : plan.priceCents === 0 ? (
                  <span className="btn-ghost w-full opacity-60">Plan base</span>
                ) : (
                  <CheckoutButton type="MEMBERSHIP" planId={plan.id} label="Suscribirme" className="w-full" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Historial de pagos */}
      <section className="mt-12">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-bone">
          <Receipt className="h-5 w-5 text-gold" /> Historial de pagos
        </h2>
        {orders.length === 0 ? (
          <p className="text-bone-muted">Aún no tienes compras registradas.</p>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-faint">
                <tr>
                  <th className="px-5 py-3 font-semibold">Concepto</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 text-right font-semibold">Monto</th>
                  <th className="px-5 py-3 text-right font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-ink-line/60 last:border-0">
                    <td className="px-5 py-3 font-medium text-bone">{ORDER_LABELS[o.type] ?? o.type}</td>
                    <td className="px-5 py-3 text-bone-muted">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3 text-right text-bone">{formatPrice(o.amountCents)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="chip border-green-500/40 text-green-300">{o.status === 'PAID' ? 'Pagado' : o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
