import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Crown, Clock, BookOpen, AlertTriangle } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { evaluateAccess } from '@/lib/access'
import { CATEGORIES, BELTS } from '@/lib/brand'
import { formatPrice } from '@/lib/utils'
import { CoursePlayer, CourseLocked } from '@/components/content/CoursePlayer'
import { CheckoutButton } from '@/components/content/CheckoutButton'
import { BeltBadge } from '@/components/ui/BeltBadge'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await db.courses.bySlug(slug)
  return { title: course?.title ?? 'Curso' }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await db.courses.bySlug(slug)
  if (!course) notFound()

  const user = await requireUser()
  const [hasMembership, orders, progress] = await Promise.all([
    db.memberships.isActive(user.id),
    db.orders.forUser(user.id),
    db.progress.forUser(user.id),
  ])

  const purchasedCourseIds = orders
    .filter((o) => o.status === 'PAID' && o.type === 'COURSE' && o.courseId)
    .map((o) => o.courseId!)
  const access = evaluateAccess(course, user, { hasMembership, purchasedCourseIds })
  const completedLessonIds = progress.filter((p) => p.completed).map((p) => p.lessonId)
  const cat = CATEGORIES[course.category]

  return (
    <div>
      <Link href="/dashboard/biblioteca" className="mb-6 inline-flex items-center gap-1.5 text-sm text-bone-muted hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Biblioteca
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full px-2.5 py-1 text-xs font-bold uppercase text-ink" style={{ background: cat.accent }}>
            {cat.emoji} {cat.label}
          </span>
          <BeltBadge belt={course.requiredBelt} size="sm" />
        </div>
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-bone sm:text-4xl">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-bone-muted">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-bone-faint">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.durationMin} min</span>
          <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {course.lessons.length} lecciones</span>
        </div>
      </div>

      {access.beltLocked && access.canAccess && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Este curso recomienda cinturón <strong>{BELTS[course.requiredBelt].label}</strong> o superior.
            Puedes verlo, pero asegúrate de dominar lo anterior.
          </p>
        </div>
      )}

      {access.canAccess ? (
        <CoursePlayer course={course} completedLessonIds={completedLessonIds} />
      ) : (
        <CourseLocked>
          {access.reason === 'NEEDS_MEMBERSHIP' && (
            <>
              <h2 className="font-heading text-2xl font-bold text-bone">Contenido para miembros</h2>
              <p className="max-w-md text-bone-muted">
                Este curso es parte de la biblioteca premium. Hazte miembro y desbloquea
                las 7 categorías completas.
              </p>
              <Link href="/dashboard/membresia" className="btn-gold">
                <Crown className="h-4 w-4" /> Ver membresías
              </Link>
            </>
          )}
          {access.reason === 'NEEDS_PURCHASE' && (
            <>
              <h2 className="font-heading text-2xl font-bold text-bone">Compra este curso</h2>
              <p className="max-w-md text-bone-muted">
                Accede de por vida a este curso por un único pago, o desbloquéalo
                gratis con tu membresía.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <CheckoutButton
                  type="COURSE"
                  courseId={course.id}
                  label={`Comprar por ${formatPrice(course.priceCents)}`}
                />
                <Link href="/dashboard/membresia" className="btn-ghost">O hazte miembro</Link>
              </div>
            </>
          )}
        </CourseLocked>
      )}

      {/* Vista previa del temario aunque esté bloqueado */}
      {!access.canAccess && (
        <div className="mt-8">
          <h3 className="mb-3 font-heading text-lg font-bold text-bone">Lo que aprenderás</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {course.lessons.map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-xl border border-ink-line bg-ink-card p-3 text-sm text-bone-muted">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-bold text-gold">{l.order}</span>
                {l.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
