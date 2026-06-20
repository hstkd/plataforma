import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/brand'
import { Reveal } from '@/components/ui/Reveal'

export function Categories() {
  return (
    <section id="categorias" className="container-x py-24">
      <Reveal>
        <span className="eyebrow">La biblioteca</span>
        <h2 className="display mt-3 text-4xl text-bone sm:text-6xl">
          7 disciplinas. <span className="gradient-text">Un solo lugar.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-bone-muted">
          Cada categoría es una ruta de aprendizaje con videos, ejercicios y nivel requerido.
          Avanza a tu ritmo y desbloquea contenido según tu cinturón.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map((key, i) => {
          const c = CATEGORIES[key]
          return (
            <Reveal key={key} delay={i * 0.05}>
              <Link
                href={`/dashboard/biblioteca?cat=${key}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-line bg-ink-card p-6 transition-all hover:-translate-y-1 hover:border-gold/40"
              >
                <div
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                  style={{ background: c.accent }}
                />
                <span className="text-4xl">{c.emoji}</span>
                <h3 className="mt-4 font-heading text-xl font-extrabold text-bone">{c.label}</h3>
                <p className="mt-2 flex-1 text-sm text-bone-muted">{c.blurb}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gold">
                  Explorar
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          )
        })}

        <Reveal delay={CATEGORY_ORDER.length * 0.05}>
          <Link
            href="/register"
            className="flex h-full min-h-[200px] flex-col items-start justify-between rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/15 to-transparent p-6 transition hover:from-gold/25"
          >
            <span className="text-4xl">🥇</span>
            <div>
              <h3 className="font-heading text-xl font-extrabold text-bone">Accede a todo</h3>
              <p className="mt-2 text-sm text-bone-muted">
                Hazte miembro y desbloquea las 7 categorías completas.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gold">
                Ver planes <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
