import { BELTS, BELT_ORDER } from '@/lib/brand'
import type { Belt } from '@/lib/types'
import { beltProgress } from '@/lib/utils'
import { cn } from '@/lib/utils'

/** Tarjeta de progreso de cinturón gamificada (estilo Duolingo). */
export function BeltProgress({ belt, xp }: { belt: Belt; xp: number }) {
  const { pct, toNext } = beltProgress(xp)
  const currentLevel = BELTS[belt].level
  const nextBelt = BELT_ORDER[Math.min(currentLevel + 1, BELT_ORDER.length - 1)]
  const isMax = belt === 'BLACK'

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Tu rango</span>
          <p className="mt-1 font-display text-2xl font-bold uppercase text-bone">
            Cinturón {BELTS[belt].label}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-gold">{xp.toLocaleString()}</p>
          <p className="text-xs text-bone-muted">XP total</p>
        </div>
      </div>

      {/* Cinturones */}
      <div className="mt-6 flex items-center gap-1.5">
        {BELT_ORDER.map((b) => {
          const reached = BELTS[b].level <= currentLevel
          return (
            <div key={b} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn('h-2.5 w-full rounded-full ring-1 ring-inset ring-black/30', !reached && 'opacity-30')}
                style={{ background: BELTS[b].hex }}
              />
              <span className={cn('text-[10px]', reached ? 'text-bone-muted' : 'text-bone-faint')}>
                {BELTS[b].label}
              </span>
            </div>
          )
        })}
      </div>

      {!isMax ? (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-bone-muted">Hacia cinturón {BELTS[nextBelt].label}</span>
            <span className="font-semibold text-bone">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-bone-faint">
            Te faltan <span className="font-semibold text-gold">{toNext.toLocaleString()} XP</span> para subir de cinturón.
            Completa lecciones para ganar +50 XP cada una.
          </p>
        </div>
      ) : (
        <p className="mt-5 text-sm text-gold">🥇 Has alcanzado la maestría. ¡Cinturón negro!</p>
      )}
    </div>
  )
}
