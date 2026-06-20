'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2, Save } from 'lucide-react'
import { CATEGORIES, CATEGORY_ORDER, BELT_ORDER, BELTS } from '@/lib/brand'

interface LessonDraft {
  title: string
  videoUrl: string
  description: string
  durationSec: number
}

const emptyLesson = (): LessonDraft => ({ title: '', videoUrl: '', description: '', durationSec: 300 })

export function CourseForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [access, setAccess] = useState('MEMBERSHIP')
  const [lessons, setLessons] = useState<LessonDraft[]>([emptyLesson()])

  function updateLesson(i: number, patch: Partial<LessonDraft>) {
    setLessons((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const payload = {
      title: form.get('title'),
      category: form.get('category'),
      summary: form.get('summary'),
      description: form.get('description'),
      coverUrl: form.get('coverUrl'),
      trailerUrl: form.get('trailerUrl') || '',
      requiredBelt: form.get('requiredBelt'),
      access: form.get('access'),
      priceCents: Math.round(Number(form.get('price') || 0) * 100),
      durationMin: Number(form.get('durationMin') || 0),
      lessons: lessons.filter((l) => l.title && l.videoUrl),
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo crear el curso')
        setLoading(false)
        return
      }
      onClose()
      router.refresh()
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Título del curso</label>
          <input name="title" className="input" placeholder="Ej. Patadas dobles avanzadas" required />
        </div>
        <div>
          <label className="label">Categoría</label>
          <select name="category" className="input" defaultValue="TECNICA">
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>{CATEGORIES[c].label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Cinturón requerido</label>
          <select name="requiredBelt" className="input" defaultValue="WHITE">
            {BELT_ORDER.map((b) => (
              <option key={b} value={b}>{BELTS[b].label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Resumen corto</label>
          <input name="summary" className="input" placeholder="Una línea que enganche" required />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Descripción</label>
          <textarea name="description" className="input min-h-[80px] resize-none" placeholder="Describe el curso…" required />
        </div>
        <div>
          <label className="label">URL de portada</label>
          <input name="coverUrl" className="input" defaultValue="https://picsum.photos/seed/nuevo/960/600" required />
        </div>
        <div>
          <label className="label">URL del tráiler (opcional)</label>
          <input name="trailerUrl" className="input" placeholder="https://…mp4" />
        </div>
        <div>
          <label className="label">Duración total (min)</label>
          <input name="durationMin" type="number" min={0} className="input" defaultValue={45} />
        </div>
        <div>
          <label className="label">Tipo de acceso</label>
          <select name="access" className="input" value={access} onChange={(e) => setAccess(e.target.value)}>
            <option value="FREE">Gratis</option>
            <option value="MEMBERSHIP">Solo miembros</option>
            <option value="PURCHASE">Compra individual</option>
          </select>
        </div>
        {access === 'PURCHASE' && (
          <div>
            <label className="label">Precio (USD)</label>
            <input name="price" type="number" min={0} step="0.01" className="input" defaultValue={24} />
          </div>
        )}
      </div>

      {/* Lecciones */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Lecciones</label>
          <button type="button" onClick={() => setLessons((p) => [...p, emptyLesson()])} className="inline-flex items-center gap-1 text-sm font-semibold text-gold">
            <Plus className="h-4 w-4" /> Añadir lección
          </button>
        </div>
        <div className="space-y-3">
          {lessons.map((l, i) => (
            <div key={i} className="rounded-xl border border-ink-line bg-ink-soft p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-bone-faint">Lección {i + 1}</span>
                {lessons.length > 1 && (
                  <button type="button" onClick={() => setLessons((p) => p.filter((_, idx) => idx !== i))} className="text-bone-faint hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input className="input" placeholder="Título de la lección" value={l.title} onChange={(e) => updateLesson(i, { title: e.target.value })} />
                <input className="input" placeholder="URL del video (.mp4)" value={l.videoUrl} onChange={(e) => updateLesson(i, { videoUrl: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-gold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Crear curso</>}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
      </div>
    </form>
  )
}
