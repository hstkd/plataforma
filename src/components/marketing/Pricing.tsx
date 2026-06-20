import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Plan } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/Reveal'

export function Pricing({ plans }: { plans: Plan[] }) {
  return (
    <section id="planes" className="container-x py-24">
      <Reveal className="text-center">
        <span className="eyebrow">Membresías</span>
        <h2 className="display mt-3 text-4xl text-bone sm:text-6xl">
          Elige tu <span className="gradient-text">cinturón de acceso</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-bone-muted">
          Sin permanencia. Cancela cuando quieras. También puedes comprar cursos
          o clases privadas de forma individual.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08}>
            <div
              className={cn(
                'relative flex h-full flex-col rounded-3xl border p-7',
                plan.highlighted
                  ? 'border-gold/60 bg-gradient-to-b from-gold/10 to-ink-card shadow-gold'
                  : 'border-ink-line bg-ink-card',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                  Más popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold uppercase text-bone">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-5xl font-extrabold text-bone">
                  {plan.priceCents === 0 ? 'Gratis' : formatPrice(plan.priceCents)}
                </span>
                {plan.priceCents > 0 && (
                  <span className="text-bone-muted">/{plan.interval === 'MONTH' ? 'mes' : 'año'}</span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-bone-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/register?plan=${plan.slug}`}
                className={cn('mt-7 w-full', plan.highlighted ? 'btn-gold' : 'btn-ghost')}
              >
                {plan.priceCents === 0 ? 'Crear cuenta' : 'Suscribirme'}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
