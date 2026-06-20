'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Play, Dumbbell, Loader2, Lock } from 'lucide-react'
import type { Course } from '@/lib/types'
import { formatDuration, cn } from '@/lib/utils'

export function CoursePlayer({
  course,
  completedLessonIds,
}: {
  course: Course
  completedLessonIds: string[]
}) {
  const router = useRouter()
  const [activeIdx, setActiveIdx] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedLessonIds))
  const [saving, setSaving] = useState(false)

  const lesson = course.lessons[activeIdx]
  const isDone = completed.has(lesson.id)

  async function toggle() {
    setSaving(true)
    const next = !isDone
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, completed: next }),
      })
      if (res.ok) {
        setCompleted((prev) => {
          const s = new Set(prev)
          if (next) s.add(lesson.id)
          else s.delete(lesson.id)
          return s
        })
        // Avanza a la siguiente lección al completar.
        if (next && activeIdx < course.lessons.length - 1) {
          setTimeout(() => setActiveIdx((i) => i + 1), 400)
        }
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Reproductor + detalle de lección */}
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-ink-line bg-black">
          <video
            key={lesson.id}
            className="aspect-video w-full"
            controls
            poster={course.coverUrl}
            src={lesson.videoUrl}
          />
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow">Lección {lesson.order} de {course.lessons.length}</span>
              <h2 className="mt-1 font-heading text-2xl font-bold text-bone">{lesson.title}</h2>
            </div>
            <button
              onClick={toggle}
              disabled={saving}
              className={cn(
                'btn shrink-0',
                isDone ? 'border border-green-500/40 bg-green-500/15 text-green-300' : 'btn-gold',
              )}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isDone ? (
                <><CheckCircle2 className="h-4 w-4" /> Completada</>
              ) : (
                <><Circle className="h-4 w-4" /> Marcar completada</>
              )}
            </button>
          </div>
          <p className="mt-3 text-bone-muted">{lesson.description}</p>
        </div>

        {/* Ejercicios */}
        {lesson.drills.length > 0 && (
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-bone">
              <Dumbbell className="h-5 w-5 text-gold" /> Ejercicios de esta lección
            </h3>
            <ul className="mt-4 space-y-3">
              {lesson.drills.map((d) => (
                <li key={d.id} className="flex items-start gap-3 rounded-xl border border-ink-line bg-ink-soft p-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gold/15 text-sm font-bold text-gold">
                    {d.reps.match(/\d+/)?.[0] ?? '•'}
                  </span>
                  <div>
                    <p className="font-semibold text-bone">{d.name}</p>
                    <p className="text-sm text-gold">{d.reps}</p>
                    {d.notes && <p className="mt-0.5 text-xs text-bone-muted">{d.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lista de lecciones */}
      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <div className="card overflow-hidden">
          <div className="border-b border-ink-line p-4">
            <p className="text-sm font-semibold text-bone">Contenido del curso</p>
            <p className="text-xs text-bone-muted">
              {completed.size} de {course.lessons.length} lecciones completadas
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${(completed.size / course.lessons.length) * 100}%` }}
              />
            </div>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto">
            {course.lessons.map((l, i) => {
              const done = completed.has(l.id)
              const active = i === activeIdx
              return (
                <li key={l.id}>
                  <button
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      'flex w-full items-center gap-3 border-b border-ink-line/60 px-4 py-3 text-left transition',
                      active ? 'bg-gold/10' : 'hover:bg-white/5',
                    )}
                  >
                    <span className="shrink-0">
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : active ? (
                        <Play className="h-5 w-5 text-gold" />
                      ) : (
                        <Circle className="h-5 w-5 text-bone-faint" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-sm font-medium', active ? 'text-bone' : 'text-bone-muted')}>
                        {l.order}. {l.title}
                      </span>
                      <span className="text-xs text-bone-faint">{formatDuration(l.durationSec)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </div>
  )
}

/** Vista bloqueada cuando el usuario no tiene acceso al curso. */
export function CourseLocked({ children }: { children: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-4 p-10 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
        <Lock className="h-7 w-7" />
      </span>
      {children}
    </div>
  )
}
