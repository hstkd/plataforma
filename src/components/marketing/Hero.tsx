'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Star, ChevronDown } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { VIDEO_HERO } from '@/lib/db/seed'

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://picsum.photos/seed/tkdhero/1600/900"
      >
        <source src={VIDEO_HERO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/30 to-transparent" />

      <div className="container-x relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
            {BRAND.korean} · Academia online premium
          </span>

          <h1 className="display mt-5 text-5xl text-bone sm:text-7xl lg:text-8xl">
            Entrena como un
            <br />
            <span className="gradient-text">campeón.</span>
            <br />
            <span className="text-stroke">Donde sea.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-bone-muted">
            Cursos en video, rutas de progreso por cinturón, clases privadas por Zoom
            y la guía del maestro <strong className="text-bone">{BRAND.master}</strong>.
            Tu dojang, ahora en tu bolsillo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/register" className="btn-gold text-base">
              Empezar gratis
            </Link>
            <Link href="/#categorias" className="btn-ghost text-base">
              <Play className="h-4 w-4" />
              Ver biblioteca
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-bone-muted">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
              <span className="ml-1 font-semibold text-bone">4.9/5</span>
            </div>
            <span className="hidden h-4 w-px bg-ink-line sm:block" />
            <span>+500 alumnos formados desde {BRAND.since}</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-bone-faint"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.div>
    </section>
  )
}
