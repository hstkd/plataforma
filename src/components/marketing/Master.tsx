import Image from 'next/image'
import { Award, Medal, Users } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { Reveal } from '@/components/ui/Reveal'

const HIGHLIGHTS = [
  { icon: Award, value: '4.º Dan', label: 'Cinturón negro certificado' },
  { icon: Users, value: '+500', label: 'Alumnos formados' },
  { icon: Medal, value: '2', label: 'Equipos de competencia' },
]

export function Master() {
  return (
    <section id="maestro" className="relative overflow-hidden border-y border-ink-line bg-ink-soft py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gold/20 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ink-line">
              <Image
                src="https://picsum.photos/seed/maestrohs/800/1000"
                alt={`Maestro ${BRAND.master}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="font-display text-2xl font-bold uppercase text-bone">{BRAND.master}</p>
                <p className="text-sm text-gold">{BRAND.masterTitle}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">El maestro</span>
            <h2 className="display mt-3 text-4xl text-bone sm:text-5xl">
              Disciplina real,<br />
              <span className="gradient-text">resultados reales.</span>
            </h2>
            <p className="mt-5 text-bone-muted">
              {BRAND.master} lleva desde {BRAND.since} formando taekwondistas en {BRAND.locations.join(' y ')},
              de la iniciación al alto rendimiento. Ahora trae todo ese método a una plataforma
              digital para que entrenes con la misma exigencia, estés donde estés.
            </p>
            <p className="mt-4 text-bone-muted">
              Cada curso refleja su filosofía: técnica impecable, progresión inteligente
              y el espíritu indomable del Taekwondo.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.label} delay={0.1 + i * 0.08}>
                <div className="card p-4 text-center">
                  <h.icon className="mx-auto h-6 w-6 text-gold" />
                  <p className="mt-2 font-display text-2xl font-bold text-bone">{h.value}</p>
                  <p className="text-xs text-bone-muted">{h.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
