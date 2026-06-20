import { PrismaClient } from '@prisma/client'
import { seedUsers, seedPlans, seedCourses } from '../src/lib/db/seed'
import { hashPassword } from '../src/lib/auth/password'

// =====================================================================
// Seed idempotente de PostgreSQL. Carga el contenido demo (planes, cursos,
// usuarios, membresía, progreso, pedidos y horarios). Seguro de re-ejecutar:
// usa upserts y no sobrescribe el progreso/XP de usuarios existentes.
//   Ejecutar: npm run db:seed   (requiere DATABASE_URL y schema aplicado)
// =====================================================================

const prisma = new PrismaClient()

function generateSlots() {
  const slots: { id: string; startsAt: Date; durationMin: number; capacity: number }[] = []
  const now = new Date()
  for (let day = 1; day <= 14; day++) {
    for (const hour of [17, 18, 19]) {
      const d = new Date(now)
      d.setDate(now.getDate() + day)
      d.setHours(hour, 0, 0, 0)
      slots.push({ id: `slot_${day}_${hour}`, startsAt: d, durationMin: 60, capacity: 1 })
    }
  }
  return slots
}

async function main() {
  // Planes
  for (const p of seedPlans) {
    const data = {
      slug: p.slug,
      name: p.name,
      priceCents: p.priceCents,
      interval: p.interval,
      features: p.features,
      highlighted: p.highlighted,
      stripePriceId: p.stripePriceId ?? null,
    }
    await prisma.plan.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } })
  }

  // Usuarios (no se sobrescriben en re-seed para conservar progreso/XP)
  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email.toLowerCase(),
        name: u.name,
        passwordHash: hashPassword(u.password),
        role: u.role,
        belt: u.belt,
        avatarUrl: u.avatarUrl,
        xp: u.xp,
        streakDays: u.streakDays,
      },
    })
  }

  // Cursos con lecciones + ejercicios (se crean una sola vez)
  for (const c of seedCourses) {
    const exists = await prisma.course.findUnique({ where: { id: c.id } })
    if (exists) continue
    await prisma.course.create({
      data: {
        id: c.id,
        slug: c.slug,
        title: c.title,
        category: c.category,
        summary: c.summary,
        description: c.description,
        coverUrl: c.coverUrl,
        trailerUrl: c.trailerUrl ?? null,
        requiredBelt: c.requiredBelt,
        access: c.access,
        priceCents: c.priceCents,
        durationMin: c.durationMin,
        published: c.published,
        lessons: {
          create: c.lessons.map((l) => ({
            id: l.id,
            order: l.order,
            title: l.title,
            videoUrl: l.videoUrl,
            description: l.description,
            durationSec: l.durationSec,
            drills: {
              create: l.drills.map((d) => ({
                id: d.id,
                name: d.name,
                reps: d.reps,
                notes: d.notes ?? null,
              })),
            },
          })),
        },
      },
    })
  }

  // Membresía activa de ejemplo para el alumno demo
  await prisma.membership.upsert({
    where: { userId: 'u_demo' },
    update: {},
    create: {
      id: 'm_demo',
      userId: 'u_demo',
      planId: 'plan_pro',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24),
    },
  })

  // Progreso de ejemplo
  for (const lessonId of ['l_p1_1', 'l_p1_2', 'l_t_1', 'l_f_1']) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: 'u_demo', lessonId } },
      update: {},
      create: { userId: 'u_demo', lessonId, completed: true, completedAt: new Date() },
    })
  }

  // Historial de pedidos de ejemplo
  await prisma.order.upsert({
    where: { id: 'o_1' },
    update: {},
    create: {
      id: 'o_1', userId: 'u_demo', type: 'MEMBERSHIP', status: 'PAID',
      amountCents: 1900, currency: 'usd', createdAt: new Date(Date.now() - 6e8),
    },
  })
  await prisma.order.upsert({
    where: { id: 'o_2' },
    update: {},
    create: {
      id: 'o_2', userId: 'u_demo', type: 'COURSE', status: 'PAID',
      amountCents: 2400, currency: 'usd', courseId: 'c_fuerza_1', createdAt: new Date(Date.now() - 3e8),
    },
  })

  // Horarios disponibles para la agenda
  for (const s of generateSlots()) {
    await prisma.availabilitySlot.upsert({
      where: { id: s.id },
      update: {},
      create: { id: s.id, startsAt: s.startsAt, durationMin: s.durationMin, capacity: s.capacity },
    })
  }

  console.log('✅ Seed completado.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
