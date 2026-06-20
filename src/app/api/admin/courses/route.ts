import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

const CATS = ['POOMSAE', 'COMBATE', 'TECNICA', 'FLEXIBILIDAD', 'FUERZA', 'VELOCIDAD', 'MENTAL'] as const
const BELTS_ENUM = ['WHITE', 'YELLOW', 'GREEN', 'BLUE', 'RED', 'BLACK'] as const
const ACCESS = ['FREE', 'MEMBERSHIP', 'PURCHASE'] as const

const lessonSchema = z.object({
  title: z.string().min(2),
  videoUrl: z.string().url(),
  description: z.string().default(''),
  durationSec: z.coerce.number().int().min(0).default(0),
})

const schema = z.object({
  title: z.string().min(3, 'Título demasiado corto'),
  category: z.enum(CATS),
  summary: z.string().min(5),
  description: z.string().min(5),
  coverUrl: z.string().url('URL de portada inválida'),
  trailerUrl: z.string().url().optional().or(z.literal('')),
  requiredBelt: z.enum(BELTS_ENUM),
  access: z.enum(ACCESS),
  priceCents: z.coerce.number().int().min(0).default(0),
  durationMin: z.coerce.number().int().min(0).default(0),
  lessons: z.array(lessonSchema).default([]),
})

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }, { status: 400 })
  }
  const d = parsed.data

  const course = await db.courses.create({
    slug: slugify(d.title),
    title: d.title,
    category: d.category,
    summary: d.summary,
    description: d.description,
    coverUrl: d.coverUrl,
    trailerUrl: d.trailerUrl || undefined,
    requiredBelt: d.requiredBelt,
    access: d.access,
    priceCents: d.access === 'PURCHASE' ? d.priceCents : 0,
    durationMin: d.durationMin,
    published: true,
    lessons: d.lessons.map((l, i) => ({
      id: `l_${Date.now()}_${i}`,
      order: i + 1,
      title: l.title,
      videoUrl: l.videoUrl,
      description: l.description,
      durationSec: l.durationSec,
      drills: [],
    })),
  })

  return NextResponse.json({ ok: true, slug: course.slug })
}
