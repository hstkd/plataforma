import Image from 'next/image'
import { db } from '@/lib/db'
import { BELTS } from '@/lib/brand'
import { PageHeader } from '@/components/app/PageHeader'
import { BeltBadge } from '@/components/ui/BeltBadge'
import { formatDate } from '@/lib/datetime'

export default async function AdminStudentsPage() {
  const allUsers = await db.users.all()
  const students = allUsers.filter((u) => u.role === 'STUDENT')

  const rows = await Promise.all(
    students.map(async (u) => {
      const [membership, stats] = await Promise.all([
        db.memberships.forUser(u.id),
        db.progress.statsForUser(u.id),
      ])
      const plan = membership ? await db.plans.byId(membership.planId) : null
      const active = membership?.status === 'ACTIVE' && new Date(membership.currentPeriodEnd) > new Date()
      return { u, planName: active ? plan?.name : null, completed: stats.completedLessons }
    }),
  )

  return (
    <div>
      <PageHeader
        eyebrow="Comunidad"
        title="Alumnos"
        description={`${students.length} alumnos registrados en la academia.`}
      />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-ink-line text-left text-xs uppercase tracking-wider text-bone-faint">
            <tr>
              <th className="px-5 py-3 font-semibold">Alumno</th>
              <th className="px-5 py-3 font-semibold">Cinturón</th>
              <th className="px-5 py-3 font-semibold">Membresía</th>
              <th className="px-5 py-3 text-right font-semibold">XP</th>
              <th className="px-5 py-3 text-right font-semibold">Lecciones</th>
              <th className="px-5 py-3 text-right font-semibold">Registro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ u, planName, completed }) => (
              <tr key={u.id} className="border-b border-ink-line/60 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatarUrl} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-bone">{u.name}</p>
                      <p className="text-xs text-bone-faint">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3"><BeltBadge belt={u.belt} size="sm" /></td>
                <td className="px-5 py-3">
                  {planName ? (
                    <span className="chip border-gold/40 text-gold">{planName}</span>
                  ) : (
                    <span className="chip">Gratis</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-bone">{u.xp.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-bone-muted">{completed}</td>
                <td className="px-5 py-3 text-right text-bone-muted">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-6 text-center text-bone-muted">Sin alumnos todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
