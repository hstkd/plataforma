'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, X, Loader2, Calendar, Check, Clock } from 'lucide-react'
import type { AvailabilitySlot, Booking } from '@/lib/types'
import { formatTime, formatDayLabel, formatDateTime } from '@/lib/datetime'
import { cn } from '@/lib/utils'

type BookingWithSlot = Booking & { slot: AvailabilitySlot }

const FOCUS_PRESETS = ['Combate / Kyorugi', 'Poomsae', 'Técnica de patadas', 'Preparación física', 'Preparación para examen']

export function BookingCalendar({
  slots,
  bookings,
}: {
  slots: AvailabilitySlot[]
  bookings: BookingWithSlot[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null)
  const [focus, setFocus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Agrupa slots por día.
  const days = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>()
    for (const s of slots) {
      const key = new Date(s.startsAt).toISOString().slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    return Array.from(map.entries()).slice(0, 10)
  }, [slots])

  async function confirm() {
    if (!selected || !focus.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selected.id, focus }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'No se pudo reservar')
        setLoading(false)
        return
      }
      setSelected(null)
      setFocus('')
      setLoading(false)
      router.refresh()
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  async function cancel(bookingId: string) {
    await fetch('/api/bookings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    })
    router.refresh()
  }

  const upcoming = bookings.filter((b) => b.status === 'CONFIRMED' && new Date(b.slot.startsAt) > new Date())

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Calendario de disponibilidad */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-bone">
          <Calendar className="h-5 w-5 text-gold" /> Horarios disponibles
        </h2>
        <div className="space-y-3">
          {days.map(([day, daySlots]) => (
            <div key={day} className="card p-4">
              <p className="mb-3 text-sm font-semibold capitalize text-bone">{formatDayLabel(day)}</p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition',
                      selected?.id === s.id
                        ? 'border-gold bg-gold text-ink'
                        : 'border-ink-line bg-ink-soft text-bone-muted hover:border-gold/40 hover:text-bone',
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" /> {formatTime(s.startsAt)}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {days.length === 0 && <p className="text-bone-muted">No hay horarios disponibles por ahora.</p>}
        </div>
      </div>

      {/* Panel de reserva + próximas clases */}
      <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
        {/* Formulario de reserva */}
        <div className="card p-5">
          <h3 className="font-heading text-lg font-bold text-bone">Reservar clase privada</h3>
          {selected ? (
            <div className="mt-3 space-y-4">
              <div className="rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm">
                <p className="font-semibold capitalize text-bone">{formatDateTime(selected.startsAt)}</p>
                <p className="text-bone-muted">{selected.durationMin} min · por Zoom</p>
              </div>
              <div>
                <label className="label">¿En qué quieres enfocarte?</label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {FOCUS_PRESETS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFocus(f)}
                      className={cn('rounded-full border px-2.5 py-1 text-xs', focus === f ? 'border-gold bg-gold/15 text-gold' : 'border-ink-line text-bone-muted')}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <textarea
                  className="input min-h-[80px] resize-none"
                  placeholder="Describe tu objetivo para esta clase…"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-300">{error}</p>}
              <div className="flex gap-2">
                <button onClick={confirm} disabled={loading || !focus.trim()} className="btn-gold flex-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Confirmar</>}
                </button>
                <button onClick={() => setSelected(null)} className="btn-ghost">Cancelar</button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-bone-muted">
              Selecciona un horario disponible para reservar tu clase 1 a 1 con el maestro.
              Recibirás un enlace de Zoom al confirmar.
            </p>
          )}
        </div>

        {/* Próximas clases */}
        <div>
          <h3 className="mb-3 font-heading text-lg font-bold text-bone">Tus próximas clases</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-bone-muted">No tienes clases agendadas.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-bone">{b.focus}</p>
                      <p className="text-xs capitalize text-bone-muted">{formatDateTime(b.slot.startsAt)}</p>
                    </div>
                    <button onClick={() => cancel(b.id)} className="text-bone-faint hover:text-red-300" aria-label="Cancelar">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {b.zoomJoinUrl && (
                    <a href={b.zoomJoinUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-3 w-full text-xs">
                      <Video className="h-3.5 w-3.5" /> Unirme por Zoom
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
