import { BELTS } from '@/lib/brand'
import type { Belt } from '@/lib/types'
import { cn } from '@/lib/utils'

export function BeltBadge({
  belt,
  size = 'md',
  showLabel = true,
  className,
}: {
  belt: Belt
  size?: 'sm' | 'md'
  showLabel?: boolean
  className?: string
}) {
  const b = BELTS[belt]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-ink-line bg-white/5 font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
    >
      <span
        className="inline-block h-3 w-6 rounded-sm ring-1 ring-inset ring-black/30"
        style={{ background: b.hex }}
      />
      {showLabel && <span>Cinturón {b.label}</span>}
    </span>
  )
}
