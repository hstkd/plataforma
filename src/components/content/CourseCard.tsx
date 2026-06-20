import Link from 'next/link'
import Image from 'next/image'
import { Lock, Play, Clock, Crown, ShoppingCart } from 'lucide-react'
import { CATEGORIES, BELTS } from '@/lib/brand'
import type { Course } from '@/lib/types'
import { cn } from '@/lib/utils'

export function CourseCard({
  course,
  locked = false,
  badge,
  progressPct,
}: {
  course: Course
  locked?: boolean
  badge?: 'MEMBERSHIP' | 'PURCHASE' | 'FREE'
  progressPct?: number
}) {
  const cat = CATEGORIES[course.category]
  const accessBadge = badge ?? course.access

  return (
    <Link
      href={`/dashboard/biblioteca/${course.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-line bg-ink-card transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.coverUrl}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn('object-cover transition duration-500 group-hover:scale-105', locked && 'blur-[2px] brightness-50')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-card via-transparent to-transparent" />

        {/* Badge categoría */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ink"
          style={{ background: cat.accent }}
        >
          {cat.emoji} {cat.label}
        </span>

        {/* Acceso */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          {accessBadge === 'FREE' && <span className="text-green-400">Gratis</span>}
          {accessBadge === 'MEMBERSHIP' && (<><Crown className="h-3 w-3 text-gold" /> Miembros</>)}
          {accessBadge === 'PURCHASE' && (<><ShoppingCart className="h-3 w-3 text-gold" /> Compra</>)}
        </span>

        {/* Play / Lock central */}
        <div className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-gold">
            {locked ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5 fill-ink" />}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold leading-snug text-bone">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-bone-muted">{course.summary}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-bone-faint">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.durationMin} min</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-4 rounded-sm" style={{ background: BELTS[course.requiredBelt].hex }} />
            {BELTS[course.requiredBelt].label}
          </span>
          <span>· {course.lessons.length} lecciones</span>
        </div>

        {typeof progressPct === 'number' && progressPct > 0 && (
          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="mt-1 block text-xs text-bone-faint">{progressPct}% completado</span>
          </div>
        )}
      </div>
    </Link>
  )
}
