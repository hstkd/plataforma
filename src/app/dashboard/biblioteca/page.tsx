import Link from 'next/link'
import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/brand'
import { evaluateAccess } from '@/lib/access'
import { CourseCard } from '@/components/content/CourseCard'
import { PageHeader } from '@/components/app/PageHeader'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Biblioteca' }

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const activeCat = (CATEGORY_ORDER as string[]).includes(cat ?? '') ? (cat as Category) : undefined

  const user = await requireUser()
  const [courses, hasMembership, orders, progress] = await Promise.all([
    db.courses.all(activeCat ? { category: activeCat } : undefined),
    db.memberships.isActive(user.id),
    db.orders.forUser(user.id),
    db.progress.forUser(user.id),
  ])

  const purchasedCourseIds = orders
    .filter((o) => o.status === 'PAID' && o.type === 'COURSE' && o.courseId)
    .map((o) => o.courseId!)
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId))

  const pctFor = (courseId: string) => {
    const c = courses.find((x) => x.id === courseId)
    if (!c || !c.lessons.length) return 0
    return Math.round((c.lessons.filter((l) => completedIds.has(l.id)).length / c.lessons.length) * 100)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Biblioteca"
        title="Explora y entrena"
        description="Cursos en video organizados por disciplina. Filtra por categoría y avanza según tu cinturón."
      />

      {/* Filtro de categorías */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        <FilterChip href="/dashboard/biblioteca" active={!activeCat} label="Todas" />
        {CATEGORY_ORDER.map((c) => (
          <FilterChip
            key={c}
            href={`/dashboard/biblioteca?cat=${c}`}
            active={activeCat === c}
            label={`${CATEGORIES[c].emoji} ${CATEGORIES[c].label}`}
          />
        ))}
      </div>

      {courses.length === 0 ? (
        <p className="text-bone-muted">No hay cursos en esta categoría todavía.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const access = evaluateAccess(course, user, { hasMembership, purchasedCourseIds })
            return (
              <CourseCard
                key={course.id}
                course={course}
                locked={!access.canAccess}
                progressPct={pctFor(course.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition',
        active
          ? 'border-gold bg-gold text-ink'
          : 'border-ink-line bg-ink-card text-bone-muted hover:border-gold/40 hover:text-bone',
      )}
    >
      {label}
    </Link>
  )
}
