import { DollarSign, Users, Crown, Clapperboard, CalendarCheck, ShoppingBag } from 'lucide-react'
import { db } from '@/lib/db'
import { StatCard } from '@/components/app/StatCard'
import { PageHeader } from '@/components/app/PageHeader'
import { formatPrice } from '@/lib/utils'
import { formatDate } from '@/lib/datetime'

const ORDER_LABELS: Record<string, string> = {
  MEMBERSHIP: 'Membresía',
  COURSE: 'Curso',
  PRIVATE_CLASS: 'Clase privada',
}

export default async function AdminOverview() {
  const [overview, beltDist, orders, users] = await Promise.all([
    db.admin.overview(),
    db.admin.beltDistribution(),
    db.orders.all(),
    db.users.all(),
  ])

  const maxBelt = Math.max(1, ...beltDist.map((b) => b.count))
  const userName = (id: string) => users.find((u) => u.id === id)?.name ?? 'Alumno'

  return (
    <div>
      <PageHeader eyebrow="Resumen" title="Visión general" description="Métricas clave de tu academia online." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={DollarSign} value={formatPrice(overview.revenueCents)} label="Ingresos totales" accent="#2fae6b" />
        <StatCard icon={Users} value={overview.students} label="Alumnos" accent="#2f6fd8" />
        <StatCard icon={Crown} value={overview.activeMembers} label="Miembros activos" accent="#ffd400" />
        <StatCard icon={Clapperboard} value={overview.courses} label="Cursos publicados" accent="#9b5cff" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Distribución de cinturones */}
        <div className="card p-6">
          <h3 className="font-heading text-lg font-bold text-bone">Distribución por cinturón</h3>
          <div className="mt-5 space-y-3">
            {beltDist.map((b) => (
              <div key={b.belt} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm text-bone-muted">{b.label}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${(b.count / maxBelt) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-sm font-semibold text-bone">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen rápido */}
        <div className="card p-6">
          <h3 className="font-heading text-lg font-bold text-bone">Operación</h3>
          <dl className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-bone-muted"><ShoppingBag className="h-4 w-4 text-gold" /> Ventas pagadas</dt>
              <dd className="font-semibold text-bone">{overview.totalOrders}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-bone-muted"><CalendarCheck className="h-4 w-4 text-gold" /> Clases agendadas</dt>
              <dd className="font-semibold text-bone">{overview.upcomingBookings}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-bone-muted"><Crown className="h-4 w-4 text-gold" /> Tasa de conversión a miembro</dt>
              <dd className="font-semibold text-bone">
                {overview.students ? Math.round((overview.activeMembers / overview.students) * 100) : 0}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Ventas recientes */}
      <section className="mt-6">
        <h3 className="mb-4 font-heading text-lg font-bold text-bone">Ventas recientes</h3>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-faint">
              <tr>
                <th className="px-5 py-3 font-semibold">Alumno</th>
                <th className="px-5 py-3 font-semibold">Concepto</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 text-right font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b border-ink-line/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-bone">{userName(o.userId)}</td>
                  <td className="px-5 py-3 text-bone-muted">{ORDER_LABELS[o.type] ?? o.type}</td>
                  <td className="px-5 py-3 text-bone-muted">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-bone">{formatPrice(o.amountCents)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-6 text-center text-bone-muted">Sin ventas todavía.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
