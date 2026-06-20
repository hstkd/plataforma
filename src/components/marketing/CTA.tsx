import Link from 'next/link'
import { BRAND } from '@/lib/brand'
import { Reveal } from '@/components/ui/Reveal'

export function CTA() {
  return (
    <section className="container-x py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-gold/15 via-ink-card to-ink-card px-8 py-16 text-center sm:px-16">
          <div className="bg-gold-radial pointer-events-none absolute inset-0" />
          <div className="relative">
            <span className="eyebrow">{BRAND.korean} · Empieza hoy</span>
            <h2 className="display mx-auto mt-4 max-w-3xl text-4xl text-bone sm:text-6xl">
              Tu primer paso al <span className="gradient-text">cinturón negro</span> empieza ahora
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-bone-muted">
              Crea tu cuenta gratis, explora la biblioteca y entrena con el método
              del maestro {BRAND.master}. Sin tarjeta, sin compromiso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-gold text-base">Empezar gratis</Link>
              <Link href="/#planes" className="btn-ghost text-base">Ver membresías</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
