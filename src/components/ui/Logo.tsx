import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string | null }) {
  const inner = (
    <span className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gold text-ink shadow-gold">
        <span className="font-display text-lg font-bold leading-none">HS</span>
        <span className="absolute -inset-px rounded-lg ring-1 ring-inset ring-ink/20" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-bold uppercase tracking-wide text-bone">
          TKD Academy
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">
          OnLine
        </span>
      </span>
    </span>
  )
  if (href === null) return inner
  return <Link href={href} aria-label="HS TKD Academy - OnLine">{inner}</Link>
}
