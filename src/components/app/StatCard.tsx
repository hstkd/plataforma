import type { LucideIcon } from 'lucide-react'

export function StatCard({
  icon: Icon,
  value,
  label,
  accent = '#ffd400',
}: {
  icon: LucideIcon
  value: string | number
  label: string
  accent?: string
}) {
  return (
    <div className="card relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-15 blur-xl" style={{ background: accent }} />
      <Icon className="h-6 w-6" style={{ color: accent }} />
      <p className="mt-3 font-display text-3xl font-bold text-bone">{value}</p>
      <p className="text-sm text-bone-muted">{label}</p>
    </div>
  )
}
