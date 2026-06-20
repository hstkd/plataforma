import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import type { Testimonial } from '@/lib/db/seed'
import { Reveal } from '@/components/ui/Reveal'

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="testimonios" className="border-y border-ink-line bg-ink-soft py-24">
      <div className="container-x">
        <Reveal className="text-center">
          <span className="eyebrow">Testimonios</span>
          <h2 className="display mt-3 text-4xl text-bone sm:text-6xl">
            Lo que dicen <span className="gradient-text">nuestros alumnos</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="card relative flex h-full flex-col p-7">
                <Quote className="h-8 w-8 text-gold/40" />
                <blockquote className="mt-4 flex-1 text-bone">{t.text}</blockquote>
                <div className="mt-5 flex items-center gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-line pt-5">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-bone">{t.name}</p>
                    <p className="text-xs text-bone-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
