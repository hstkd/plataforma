import type { Metadata } from 'next'
import { Video, Zap } from 'lucide-react'
import { requireUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { zoomEnabled } from '@/lib/integrations/zoom'
import { PageHeader } from '@/components/app/PageHeader'
import { BookingCalendar } from '@/components/agenda/BookingCalendar'

export const metadata: Metadata = { title: 'Agenda' }

export default async function AgendaPage() {
  const user = await requireUser()
  const [slots, bookings] = await Promise.all([
    db.slots.available(),
    db.bookings.forUser(user.id),
  ])

  return (
    <div>
      <PageHeader
        eyebrow="Clases privadas"
        title="Agenda tu clase 1 a 1"
        description="Reserva entrenamiento personalizado por Zoom con el maestro. Confirmación y enlace automáticos."
      />

      {!zoomEnabled && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-ink-line bg-ink-card p-4 text-sm text-bone-muted">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p>
            <strong className="text-bone">Modo demo:</strong> los enlaces de Zoom se generan de forma simulada.
            Configura las credenciales de Zoom en <code className="text-gold">.env.local</code> para
            crear reuniones reales automáticamente.
          </p>
        </div>
      )}

      <BookingCalendar slots={slots} bookings={bookings} />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Video, t: 'En vivo por Zoom', d: 'Clase 1 a 1 con feedback en tiempo real.' },
          { icon: Zap, t: 'Confirmación automática', d: 'Recibe el enlace al instante de reservar.' },
          { icon: Video, t: 'Análisis de técnica', d: 'Corrige detalles que no ves por tu cuenta.' },
        ].map((f, i) => (
          <div key={i} className="card p-5">
            <f.icon className="h-6 w-6 text-gold" />
            <p className="mt-3 font-semibold text-bone">{f.t}</p>
            <p className="text-sm text-bone-muted">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
