import { CATEGORIES, CATEGORY_ORDER } from '@/lib/brand'

export function Marquee() {
  const items = CATEGORY_ORDER.map((c) => CATEGORIES[c].label)
  const row = [...items, ...items]
  return (
    <div className="border-y border-ink-line bg-gold py-3.5 text-ink">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {row.map((label, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.2em]">
            {label}
            <span className="text-ink/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
