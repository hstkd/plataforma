import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** XP necesaria para alcanzar cada cinturón (gamificación estilo Duolingo). */
export const BELT_XP_THRESHOLDS = [0, 500, 1200, 2200, 3600, 5500]

export function beltProgress(xp: number) {
  const idx = BELT_XP_THRESHOLDS.findIndex((t, i) => {
    const next = BELT_XP_THRESHOLDS[i + 1]
    return next === undefined || xp < next
  })
  const floor = BELT_XP_THRESHOLDS[idx]
  const ceil = BELT_XP_THRESHOLDS[idx + 1] ?? floor
  const span = ceil - floor || 1
  const pct = ceil === floor ? 100 : Math.min(100, Math.round(((xp - floor) / span) * 100))
  return { levelIndex: idx, pct, toNext: Math.max(0, ceil - xp) }
}
