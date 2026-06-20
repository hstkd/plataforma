import Link from 'next/link'
import { Flame, CheckCircle2, Timer, Trophy, CalendarDays, ArrowRight, Video } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { StatCard } from '@/components/app/StatCard'
import { BeltProgress } from '@/components/app/BeltProgress'
import { CourseCard } from '@/components/content/CourseCard'
import { formatDateTime } from '@/lib/datetime'

export default async function DashboardHome() {
  const user = await requireUser()
  const [stats, progress, courses, bookings, hasMembership] = await Promise.all([
    db.progress.statsForUser(user.id),
    db.progress.forUser(user.id),
    db.courses.all(),
    db.bookings.forUser(user.id),
    db.memberships.isActive(user.id),
  ])

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId))
  const pctFor = (courseId: string) => {
    const c = courses.find((x) => x.id === courseId)
    if (!c || c.lessons.length === 0) return 0
    const done = c.lessons.filter((l) => completedIds.has(l.id)).length
    return Math.round((done / c.lessons.length) * 100)
  }

  // "Continuar entrenando": cursos empezados pero no terminados, luego nuevos.
  const inProgress = courses.filter((c) => {
    const p = pctFor(c.id)
    return p > 0 && p < 100
  })
  const recommended = courses.filter((c) => pctFor(c.id) === 0).slice(0, 3)
  const nextBooking = bookings.find((b) => b.status === 'CONFIRMED' && new Date(b.slot.startsAt) > new Date())

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow">Tu dojang</span>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-bone sm:text-4xl">
          ¡Hola, {user.name.split(' ')[0]}! 🥋
        </h1>
        <p className="mt-2 text-bone-muted">Listo para entrenar. Esto es lo que tienes hoy.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Flame} value={user.streakDays} label="Días de racha" accent="#ff7a00" />
        <StatCard icon={CheckCircle2} value={stats.completedLessons} label="Lecciones completadas" accent="#2fae6b" />
        <StatCard icon={Timer} value={`${stats.minutesTrained}m`} label="Tiempo entrenado" accent="#2f6fd8" />
        <StatCard icon={Trophy} value={`${stats.completionPct}%`} label="Biblioteca completada" accent="#ffd400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BeltProgress belt={user.belt} xp={user.xp} />
        </div>

        {/* Próxima clase */}
        <div className="card flex flex-col p-6">
          <span className="eyebrow"><CalendarDays className="h-4 w-4" /> Próxima clase</span>
          {nextBooking ? (
            <div className="mt-3 flex flex-1 flex-col">
              <p className="font-heading text-lg font-bold text-bone">{nextBooking.focus}</p>
              <p className="mt-1 text-sm text-bone-muted">{formatDateTime(nextBooking.slot.startsAt)}</p>
              <div className="mt-auto pt-4">
                {nextBooking.zoomJoinUrl && (
                  <a href={nextBooking.zoomJoinUrl} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
                    <Video className="h-4 w-4" /> Unirme por Zoom
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-1 flex-col">
              <p className="flex-1 text-sm text-bone-muted">No tienes clases privadas agendadas.</p>
              <Link href="/dashboard/agenda" className="btn-ghost mt-4 w-full">Reservar una clase</Link>
            </div>
          )}
        </div>
      </div>

      {/* Continuar entrenando */}
      {inProgress.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-bone">Continúa entrenando</h2>
            <Link href="/dashboard/biblioteca" className="text-sm font-semibold text-gold hover:underline">
              Ver biblioteca
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                progressPct={pctFor(c.id)}
                locked={c.access !== 'FREE' && !hasMembership}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recomendados */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-bone">Recomendado para ti</h2>
          <Link href="/dashboard/biblioteca" className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline">
            Explorar todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((c) => (
            <CourseCard key={c.id} course={c} locked={c.access !== 'FREE' && !hasMembership} />
          ))}
        </div>
      </section>
    </div>
  )
}
