'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ExternalLink, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/brand'
import type { Course } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { CourseForm } from './CourseForm'

const ACCESS_LABELS: Record<string, string> = {
  FREE: 'Gratis',
  MEMBERSHIP: 'Miembros',
  PURCHASE: 'Compra',
}

export function CoursesManager({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  async function remove(id: string, title: string) {
    if (!window.confirm(`¿Eliminar el curso "${title}"?`)) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-bone-muted">{courses.length} cursos en la plataforma</p>
        <button onClick={() => setShowForm(true)} className="btn-gold">
          <Plus className="h-4 w-4" /> Nuevo curso
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-faint">
            <tr>
              <th className="px-5 py-3 font-semibold">Curso</th>
              <th className="px-5 py-3 font-semibold">Categoría</th>
              <th className="px-5 py-3 font-semibold">Acceso</th>
              <th className="px-5 py-3 font-semibold">Lecciones</th>
              <th className="px-5 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-ink-line/60 last:border-0">
                <td className="px-5 py-3 font-medium text-bone">{c.title}</td>
                <td className="px-5 py-3 text-bone-muted">{CATEGORIES[c.category].label}</td>
                <td className="px-5 py-3">
                  <span className="chip">
                    {ACCESS_LABELS[c.access]}
                    {c.access === 'PURCHASE' && c.priceCents > 0 && ` · ${formatPrice(c.priceCents)}`}
                  </span>
                </td>
                <td className="px-5 py-3 text-bone-muted">{c.lessons.length}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/biblioteca/${c.slug}`} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line text-bone-muted hover:text-gold" aria-label="Ver">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button onClick={() => remove(c.id, c.title)} className="grid h-8 w-8 place-items-center rounded-lg border border-ink-line text-bone-muted hover:text-red-300" aria-label="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de creación */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-ink-line bg-ink-card p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-bone">Crear nuevo curso</h2>
              <button onClick={() => setShowForm(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-line">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CourseForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
