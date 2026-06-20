import { Video, CalendarX } from 'lucide-react'
import { db } from '@/lib/db'
import { PageHeader } from '@/components/app/PageHeader'
import { formatDateTime } from '@/lib/datetime'
import { cn } from '@/lib/utils'

const STATUS: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'Confirmada', cls: 'border-green-500/40 text-green-300' },
  PENDING: { label: 'Pendiente', cls: 'border-amber-500/40 text-amber-300' },
  CANCELED: { label: 'Cancelada', cls: 'border-red-500/40 text-red-300' },
  COMPLETED: { label: 'Completada', cls: 'border-ink-line text-bone-muted' },
}

export default async function AdminBookingsPage() {
  const bookings = await db.bookings.all()
  const upcoming = bookings.filter((b) => b.status !== 'CANCELED')

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Reservas de clases privadas"
        description="Todas las clases 1 a 1 agendadas por tus alumnos."
      />

      {upcoming.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <CalendarX className="h-10 w-10 text-bone-faint" />
          <p className="text-bone-muted">No hay reservas todavía.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-faint">
              <tr>
                <th className="px-5 py-3 font-semibold">Alumno</th>
                <th className="px-5 py-3 font-semibold">Enfoque</th>
                <th className="px-5 py-3 font-semibold">Fecha y hora</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Zoom</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((b) => {
                const s = STATUS[b.status] ?? STATUS.PENDING
                return (
                  <tr key={b.id} className="border-b border-ink-line/60 last:border-0">
                    <td className="px-5 py-3 font-medium text-bone">{b.user?.name ?? 'Alumno'}</td>
                    <td className="px-5 py-3 text-bone-muted">{b.focus}</td>
                    <td className="px-5 py-3 capitalize text-bone-muted">{formatDateTime(b.slot.startsAt)}</td>
                    <td className="px-5 py-3"><span className={cn('chip', s.cls)}>{s.label}</span></td>
                    <td className="px-5 py-3 text-right">
                      {b.zoomJoinUrl ? (
                        <a href={b.zoomJoinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline">
                          <Video className="h-4 w-4" /> Abrir
                        </a>
                      ) : (
                        <span className="text-bone-faint">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
