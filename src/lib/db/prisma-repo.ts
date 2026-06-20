import { Prisma } from '@prisma/client'
import type {
  User as PUser,
  Course as PCourse,
  Lesson as PLesson,
  Drill as PDrill,
  Plan as PPlan,
  Membership as PMembership,
  Order as POrder,
  AvailabilitySlot as PSlot,
  Booking as PBooking,
  LessonProgress as PProgress,
} from '@prisma/client'
import { BELTS, BELT_ORDER } from '@/lib/brand'
import { hashPassword } from '@/lib/auth/password'
import type {
  Belt,
  Booking,
  Category,
  Course,
  Lesson,
  LessonProgress,
  Membership,
  Order,
  Plan,
  User,
} from '@/lib/types'
import { getPrisma } from './prisma'
import { seedTestimonials } from './seed'
import type { MockDB } from './mock-repo'

// =====================================================================
// Driver Prisma (PostgreSQL). Misma interfaz que mock-repo.ts.
// Los mappers convierten filas de Prisma (Date) a los tipos del dominio
// (fechas ISO string), que es lo que espera toda la UI.
// =====================================================================

const courseInclude = {
  lessons: { orderBy: { order: 'asc' as const }, include: { drills: true } },
}

type PCourseFull = PCourse & { lessons: (PLesson & { drills: PDrill[] })[] }

// --------------------------- mappers ---------------------------------

function mapUser(u: PUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    passwordHash: u.passwordHash,
    role: u.role,
    belt: u.belt,
    avatarUrl: u.avatarUrl ?? undefined,
    xp: u.xp,
    streakDays: u.streakDays,
    createdAt: u.createdAt.toISOString(),
  }
}

function mapDrill(d: PDrill) {
  return { id: d.id, name: d.name, reps: d.reps, notes: d.notes ?? undefined }
}

function mapLesson(l: PLesson & { drills: PDrill[] }): Lesson {
  return {
    id: l.id,
    order: l.order,
    title: l.title,
    videoUrl: l.videoUrl,
    description: l.description,
    durationSec: l.durationSec,
    drills: l.drills.map(mapDrill),
  }
}

function mapCourse(c: PCourseFull): Course {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    category: c.category,
    summary: c.summary,
    description: c.description,
    coverUrl: c.coverUrl,
    trailerUrl: c.trailerUrl ?? undefined,
    requiredBelt: c.requiredBelt,
    access: c.access,
    priceCents: c.priceCents,
    durationMin: c.durationMin,
    published: c.published,
    lessons: c.lessons.map(mapLesson),
  }
}

function mapPlan(p: PPlan): Plan {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    priceCents: p.priceCents,
    interval: p.interval,
    features: p.features,
    highlighted: p.highlighted,
    stripePriceId: p.stripePriceId ?? undefined,
  }
}

function mapMembership(m: PMembership): Membership {
  return {
    id: m.id,
    userId: m.userId,
    planId: m.planId,
    status: m.status,
    currentPeriodEnd: m.currentPeriodEnd.toISOString(),
  }
}

function mapOrder(o: POrder): Order {
  return {
    id: o.id,
    userId: o.userId,
    type: o.type,
    status: o.status,
    amountCents: o.amountCents,
    currency: o.currency,
    courseId: o.courseId ?? undefined,
    createdAt: o.createdAt.toISOString(),
  }
}

function mapSlot(s: PSlot) {
  return {
    id: s.id,
    startsAt: s.startsAt.toISOString(),
    durationMin: s.durationMin,
    capacity: s.capacity,
    booked: s.booked,
  }
}

function mapBooking(b: PBooking): Booking {
  return {
    id: b.id,
    userId: b.userId,
    slotId: b.slotId,
    status: b.status,
    focus: b.focus,
    zoomJoinUrl: b.zoomJoinUrl ?? undefined,
    zoomMeetingId: b.zoomMeetingId ?? undefined,
    createdAt: b.createdAt.toISOString(),
  }
}

function mapProgress(p: PProgress): LessonProgress {
  return {
    userId: p.userId,
    lessonId: p.lessonId,
    completed: p.completed,
    completedAt: p.completedAt?.toISOString() ?? undefined,
  }
}

// --------------------------- repositorio -----------------------------

export const prismaDb: MockDB = {
  users: {
    async findById(id) {
      const u = await getPrisma().user.findUnique({ where: { id } })
      return u ? mapUser(u) : null
    },
    async findByEmail(email) {
      const u = await getPrisma().user.findUnique({ where: { email: email.toLowerCase() } })
      return u ? mapUser(u) : null
    },
    async create(input) {
      const u = await getPrisma().user.create({
        data: {
          email: input.email.toLowerCase(),
          name: input.name,
          passwordHash: hashPassword(input.password),
          avatarUrl: `https://i.pravatar.cc/200?u=${encodeURIComponent(input.email)}`,
        },
      })
      return mapUser(u)
    },
    async update(id, patch) {
      const data: Prisma.UserUpdateInput = {}
      if (patch.name !== undefined) data.name = patch.name
      if (patch.avatarUrl !== undefined) data.avatarUrl = patch.avatarUrl
      if (patch.belt !== undefined) data.belt = patch.belt
      if (patch.xp !== undefined) data.xp = patch.xp
      if (patch.streakDays !== undefined) data.streakDays = patch.streakDays
      try {
        const u = await getPrisma().user.update({ where: { id }, data })
        return mapUser(u)
      } catch {
        return null
      }
    },
    async all() {
      const list = await getPrisma().user.findMany({ orderBy: { createdAt: 'asc' } })
      return list.map(mapUser)
    },
  },

  plans: {
    async all() {
      const list = await getPrisma().plan.findMany({ orderBy: { priceCents: 'asc' } })
      return list.map(mapPlan)
    },
    async bySlug(slug) {
      const p = await getPrisma().plan.findUnique({ where: { slug } })
      return p ? mapPlan(p) : null
    },
    async byId(id) {
      const p = await getPrisma().plan.findUnique({ where: { id } })
      return p ? mapPlan(p) : null
    },
  },

  courses: {
    async all(filters?: { category?: Category; includeUnpublished?: boolean }) {
      const list = await getPrisma().course.findMany({
        where: {
          ...(filters?.includeUnpublished ? {} : { published: true }),
          ...(filters?.category ? { category: filters.category } : {}),
        },
        include: courseInclude,
        orderBy: { createdAt: 'desc' },
      })
      return list.map(mapCourse)
    },
    async bySlug(slug) {
      const c = await getPrisma().course.findUnique({ where: { slug }, include: courseInclude })
      return c ? mapCourse(c) : null
    },
    async byId(id) {
      const c = await getPrisma().course.findUnique({ where: { id }, include: courseInclude })
      return c ? mapCourse(c) : null
    },
    async create(input) {
      const lessons = input.lessons ?? []
      const c = await getPrisma().course.create({
        data: {
          slug: input.slug,
          title: input.title,
          category: input.category,
          summary: input.summary,
          description: input.description,
          coverUrl: input.coverUrl,
          trailerUrl: input.trailerUrl ?? null,
          requiredBelt: input.requiredBelt,
          access: input.access,
          priceCents: input.priceCents,
          durationMin: input.durationMin,
          published: input.published,
          lessons: {
            create: lessons.map((l, i) => ({
              order: l.order ?? i + 1,
              title: l.title,
              videoUrl: l.videoUrl,
              description: l.description,
              durationSec: l.durationSec,
              drills: {
                create: (l.drills ?? []).map((d) => ({
                  name: d.name,
                  reps: d.reps,
                  notes: d.notes ?? null,
                })),
              },
            })),
          },
        },
        include: courseInclude,
      })
      return mapCourse(c)
    },
    async update(id, patch) {
      const data: Prisma.CourseUpdateInput = {}
      if (patch.title !== undefined) data.title = patch.title
      if (patch.category !== undefined) data.category = patch.category
      if (patch.summary !== undefined) data.summary = patch.summary
      if (patch.description !== undefined) data.description = patch.description
      if (patch.coverUrl !== undefined) data.coverUrl = patch.coverUrl
      if (patch.requiredBelt !== undefined) data.requiredBelt = patch.requiredBelt
      if (patch.access !== undefined) data.access = patch.access
      if (patch.priceCents !== undefined) data.priceCents = patch.priceCents
      if (patch.durationMin !== undefined) data.durationMin = patch.durationMin
      if (patch.published !== undefined) data.published = patch.published
      if (patch.slug !== undefined) data.slug = patch.slug
      if (patch.trailerUrl !== undefined) data.trailerUrl = patch.trailerUrl ?? null
      try {
        await getPrisma().course.update({ where: { id }, data })
      } catch {
        return null
      }
      const c = await getPrisma().course.findUnique({ where: { id }, include: courseInclude })
      return c ? mapCourse(c) : null
    },
    async remove(id) {
      try {
        await getPrisma().course.delete({ where: { id } })
        return true
      } catch {
        return false
      }
    },
    async lessonIndex() {
      const courses = await getPrisma().course.findMany({ include: courseInclude })
      const idx = new Map<string, { lesson: Lesson; course: Course }>()
      for (const c of courses) {
        const mapped = mapCourse(c)
        for (const lesson of mapped.lessons) idx.set(lesson.id, { lesson, course: mapped })
      }
      return idx
    },
  },

  progress: {
    async forUser(userId) {
      const list = await getPrisma().lessonProgress.findMany({ where: { userId } })
      return list.map(mapProgress)
    },
    async isComplete(userId, lessonId) {
      const row = await getPrisma().lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      })
      return !!row?.completed
    },
    async setComplete(userId, lessonId, completed) {
      const prisma = getPrisma()
      const existing = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      })
      const wasComplete = existing?.completed ?? false
      const row = await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { completed, completedAt: completed ? new Date() : null },
        create: { userId, lessonId, completed, completedAt: completed ? new Date() : null },
      })
      // Gamificación: +50 XP al completar por primera vez.
      if (completed && !wasComplete) {
        await prisma.user.update({ where: { id: userId }, data: { xp: { increment: 50 } } })
      }
      return mapProgress(row)
    },
    async statsForUser(userId) {
      const prisma = getPrisma()
      const [totalLessons, done] = await Promise.all([
        prisma.lesson.count(),
        prisma.lessonProgress.findMany({
          where: { userId, completed: true },
          include: { lesson: true },
        }),
      ])
      const minutes = done.reduce((acc, p) => acc + Math.round((p.lesson?.durationSec ?? 0) / 60), 0)
      return {
        completedLessons: done.length,
        totalLessons,
        minutesTrained: minutes,
        completionPct: totalLessons ? Math.round((done.length / totalLessons) * 100) : 0,
      }
    },
  },

  memberships: {
    async forUser(userId) {
      const m = await getPrisma().membership.findUnique({ where: { userId } })
      return m ? mapMembership(m) : null
    },
    async isActive(userId) {
      const m = await getPrisma().membership.findUnique({ where: { userId } })
      return !!m && m.status === 'ACTIVE' && m.currentPeriodEnd > new Date()
    },
    async upsert(userId, planId) {
      const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      const m = await getPrisma().membership.upsert({
        where: { userId },
        update: { planId, status: 'ACTIVE', currentPeriodEnd: end },
        create: { userId, planId, status: 'ACTIVE', currentPeriodEnd: end },
      })
      return mapMembership(m)
    },
  },

  orders: {
    async forUser(userId) {
      const list = await getPrisma().order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      return list.map(mapOrder)
    },
    async all() {
      const list = await getPrisma().order.findMany({ orderBy: { createdAt: 'desc' } })
      return list.map(mapOrder)
    },
    async create(input) {
      const o = await getPrisma().order.create({
        data: {
          userId: input.userId,
          type: input.type,
          status: input.status,
          amountCents: input.amountCents,
          currency: input.currency,
          courseId: input.courseId ?? null,
        },
      })
      return mapOrder(o)
    },
  },

  slots: {
    async available() {
      const list = await getPrisma().availabilitySlot.findMany({
        where: { booked: false, startsAt: { gt: new Date() } },
        orderBy: { startsAt: 'asc' },
      })
      return list.map(mapSlot)
    },
    async byId(id) {
      const s = await getPrisma().availabilitySlot.findUnique({ where: { id } })
      return s ? mapSlot(s) : null
    },
  },

  bookings: {
    async forUser(userId) {
      const list = await getPrisma().booking.findMany({
        where: { userId },
        include: { slot: true },
        orderBy: { slot: { startsAt: 'asc' } },
      })
      return list.map((b) => ({ ...mapBooking(b), slot: mapSlot(b.slot) }))
    },
    async all() {
      const list = await getPrisma().booking.findMany({
        include: { slot: true, user: true },
        orderBy: { slot: { startsAt: 'asc' } },
      })
      return list.map((b) => ({
        ...mapBooking(b),
        slot: mapSlot(b.slot),
        user: b.user ? mapUser(b.user) : undefined,
      }))
    },
    async create(input) {
      const prisma = getPrisma()
      return prisma.$transaction(async (tx) => {
        const slot = await tx.availabilitySlot.findUnique({ where: { id: input.slotId } })
        if (!slot || slot.booked) return null
        await tx.availabilitySlot.update({ where: { id: input.slotId }, data: { booked: true } })
        const b = await tx.booking.create({
          data: {
            userId: input.userId,
            slotId: input.slotId,
            focus: input.focus,
            status: 'CONFIRMED',
          },
        })
        return mapBooking(b)
      })
    },
    async attachZoom(bookingId, zoom) {
      try {
        const b = await getPrisma().booking.update({
          where: { id: bookingId },
          data: { zoomJoinUrl: zoom.joinUrl, zoomMeetingId: zoom.meetingId },
        })
        return mapBooking(b)
      } catch {
        return null
      }
    },
    async cancel(bookingId, userId) {
      const prisma = getPrisma()
      const b = await prisma.booking.findFirst({ where: { id: bookingId, userId } })
      if (!b) return false
      await prisma.$transaction([
        prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELED' } }),
        prisma.availabilitySlot.update({ where: { id: b.slotId }, data: { booked: false } }),
      ])
      return true
    },
  },

  testimonials: {
    async all() {
      return seedTestimonials
    },
  },

  admin: {
    async overview() {
      const prisma = getPrisma()
      const now = new Date()
      const [agg, totalOrders, students, activeMembers, courses, upcomingBookings] =
        await Promise.all([
          prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amountCents: true } }),
          prisma.order.count({ where: { status: 'PAID' } }),
          prisma.user.count({ where: { role: 'STUDENT' } }),
          prisma.membership.count({ where: { status: 'ACTIVE', currentPeriodEnd: { gt: now } } }),
          prisma.course.count(),
          prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        ])
      return {
        revenueCents: agg._sum.amountCents ?? 0,
        totalOrders,
        students,
        activeMembers,
        courses,
        upcomingBookings,
      }
    },
    async beltDistribution() {
      const grouped = await getPrisma().user.groupBy({
        by: ['belt'],
        where: { role: 'STUDENT' },
        _count: { _all: true },
      })
      const counts = new Map<Belt, number>(grouped.map((g) => [g.belt as Belt, g._count._all]))
      return BELT_ORDER.map((belt) => ({
        belt,
        label: BELTS[belt].label,
        count: counts.get(belt) ?? 0,
      }))
    },
  },
}
