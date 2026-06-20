import type { Metadata } from 'next'
import Image from 'next/image'
import { History, Flame, Trophy, Calendar } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { BELTS } from '@/lib/brand'
import { PageHeader } from '@/components/app/PageHeader'
import { BeltBadge } from '@/components/ui/BeltBadge'
import { ProfileForm } from '@/components/app/ProfileForm'
import { formatDate } from '@/lib/datetime'

export const metadata: Metadata = { title: 'Mi perfil' }

export default async function PerfilPage() {
  const user = await requireUser()
  const [progress, stats, lessonIndex] = await Promise.all([
    db.progress.forUser(user.id),
    db.progress.statsForUser(user.id),
    db.courses.lessonIndex(),
  ])

  const history = progress
    .filter((p) => p.completed)
    .map((p) => ({ ...p, item: lessonIndex.get(p.lessonId) }))
    .filter((p) => p.item)
    .sort((a, b) => +new Date(b.completedAt ?? 0) - +new Date(a.completedAt ?? 0))

  return (
    <div>
      <PageHeader eyebrow="Mi cuenta" title="Perfil del alumno" />

      {/* Cabecera del perfil */}
      <div className="card mb-8 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
        <Image src={user.avatarUrl ?? ''} alt={user.name} width={88} height={88} className="rounded-2xl object-cover" />
        <div className="flex-1">
          <h2 className="font-heading text-2xl font-bold text-bone">{user.name}</h2>
          <p className="text-sm text-bone-muted">{user.email}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <BeltBadge belt={user.belt} />
            <span className="chip">{BELTS[user.belt].meaning}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-gold">{user.xp.toLocaleString()}</p>
            <p className="text-xs text-bone-muted">XP</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-bone">{user.streakDays}</p>
            <p className="text-xs text-bone-muted">Racha</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-bone">{stats.completedLessons}</p>
            <p className="text-xs text-bone-muted">Lecciones</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Historial de entrenamientos */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-bone">
            <History className="h-5 w-5 text-gold" /> Historial de entrenamientos
          </h3>
          {history.length === 0 ? (
            <p className="text-bone-muted">Aún no has completado lecciones. ¡Empieza hoy!</p>
          ) : (
            <ol className="relative space-y-4 border-l border-ink-line pl-5">
              {history.map((h) => (
                <li key={h.lessonId} className="relative">
                  <span className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full bg-gold">
                    <Trophy className="h-2.5 w-2.5 text-ink" />
                  </span>
                  <div className="card p-3">
                    <p className="text-sm font-semibold text-bone">{h.item!.lesson.title}</p>
                    <p className="text-xs text-bone-muted">{h.item!.course.title}</p>
                    {h.completedAt && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-bone-faint">
                        <Calendar className="h-3 w-3" /> {formatDate(h.completedAt)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Datos + métricas */}
        <div className="space-y-6">
          <ProfileForm initialName={user.name} />
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-bone">
              <Flame className="h-5 w-5 text-gold" /> Tu actividad
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-bone-muted">Tiempo total entrenado</dt><dd className="font-semibold text-bone">{stats.minutesTrained} min</dd></div>
              <div className="flex justify-between"><dt className="text-bone-muted">Biblioteca completada</dt><dd className="font-semibold text-bone">{stats.completionPct}%</dd></div>
              <div className="flex justify-between"><dt className="text-bone-muted">Miembro desde</dt><dd className="font-semibold text-bone">{formatDate(user.createdAt)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
