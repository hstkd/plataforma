import { randomUUID } from 'node:crypto'
import { BELTS } from '@/lib/brand'
import { hashPassword } from '@/lib/auth/password'
import type {
  Belt,
  Booking,
  Category,
  Course,
  Lesson,
  Membership,
  Order,
  User,
} from '@/lib/types'
import { store } from './store'

// =====================================================================
// Repositorios. Misma interfaz async que tendría la versión Prisma, de
// modo que cambiar `DATA_DRIVER=prisma` solo requiere reimplementar este
// archivo contra @prisma/client sin tocar el resto de la app.
// =====================================================================

const nid = (p: string) => `${p}_${randomUUID().slice(0, 8)}`

export const db = {
  users: {
    async findById(id: string) {
      return store.users.find((u) => u.id === id) ?? null
    },
    async findByEmail(email: string) {
      return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
    },
    async create(input: { name: string; email: string; password: string }) {
      const user: User = {
        id: nid('u'),
        email: input.email.toLowerCase(),
        name: input.name,
        passwordHash: hashPassword(input.password),
        role: 'STUDENT',
        belt: 'WHITE',
        avatarUrl: `https://i.pravatar.cc/200?u=${encodeURIComponent(input.email)}`,
        xp: 0,
        streakDays: 0,
        createdAt: new Date().toISOString(),
      }
      store.users.push(user)
      return user
    },
    async update(id: string, patch: Partial<User>) {
      const u = store.users.find((x) => x.id === id)
      if (!u) return null
      Object.assign(u, patch)
      return u
    },
    async all() {
      return store.users
    },
  },

  plans: {
    async all() {
      return store.plans
    },
    async bySlug(slug: string) {
      return store.plans.find((p) => p.slug === slug) ?? null
    },
    async byId(id: string) {
      return store.plans.find((p) => p.id === id) ?? null
    },
  },

  courses: {
    async all(filters?: { category?: Category; includeUnpublished?: boolean }) {
      let list = store.courses
      if (!filters?.includeUnpublished) list = list.filter((c) => c.published)
      if (filters?.category) list = list.filter((c) => c.category === filters.category)
      return list
    },
    async bySlug(slug: string) {
      return store.courses.find((c) => c.slug === slug) ?? null
    },
    async byId(id: string) {
      return store.courses.find((c) => c.id === id) ?? null
    },
    async create(input: Omit<Course, 'id' | 'lessons'> & { lessons?: Lesson[] }) {
      const course: Course = { ...input, id: nid('c'), lessons: input.lessons ?? [] }
      store.courses.unshift(course)
      return course
    },
    async update(id: string, patch: Partial<Course>) {
      const c = store.courses.find((x) => x.id === id)
      if (!c) return null
      Object.assign(c, patch)
      return c
    },
    async remove(id: string) {
      const i = store.courses.findIndex((c) => c.id === id)
      if (i >= 0) store.courses.splice(i, 1)
      return i >= 0
    },
    /** Todas las lecciones aplanadas con su curso (para progreso). */
    async lessonIndex() {
      const idx = new Map<string, { lesson: Lesson; course: Course }>()
      for (const course of store.courses)
        for (const lesson of course.lessons) idx.set(lesson.id, { lesson, course })
      return idx
    },
  },

  progress: {
    async forUser(userId: string) {
      return store.progress.filter((p) => p.userId === userId)
    },
    async isComplete(userId: string, lessonId: string) {
      return store.progress.some((p) => p.userId === userId && p.lessonId === lessonId && p.completed)
    },
    async setComplete(userId: string, lessonId: string, completed: boolean) {
      let row = store.progress.find((p) => p.userId === userId && p.lessonId === lessonId)
      if (!row) {
        row = { userId, lessonId, completed: false }
        store.progress.push(row)
      }
      const wasComplete = row.completed
      row.completed = completed
      row.completedAt = completed ? new Date().toISOString() : undefined

      // Gamificación: +50 XP al completar una lección por primera vez.
      if (completed && !wasComplete) {
        const u = store.users.find((x) => x.id === userId)
        if (u) u.xp += 50
      }
      return row
    },
    async statsForUser(userId: string) {
      const idx = await db.courses.lessonIndex()
      const totalLessons = idx.size
      const done = store.progress.filter((p) => p.userId === userId && p.completed)
      const minutes = done.reduce((acc, p) => {
        const item = idx.get(p.lessonId)
        return acc + Math.round((item?.lesson.durationSec ?? 0) / 60)
      }, 0)
      return {
        completedLessons: done.length,
        totalLessons,
        minutesTrained: minutes,
        completionPct: totalLessons ? Math.round((done.length / totalLessons) * 100) : 0,
      }
    },
  },

  memberships: {
    async forUser(userId: string) {
      return store.memberships.find((m) => m.userId === userId) ?? null
    },
    async isActive(userId: string) {
      const m = store.memberships.find((x) => x.userId === userId)
      return !!m && m.status === 'ACTIVE' && new Date(m.currentPeriodEnd) > new Date()
    },
    async upsert(userId: string, planId: string) {
      const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
      let m = store.memberships.find((x) => x.userId === userId)
      if (m) {
        m.planId = planId
        m.status = 'ACTIVE'
        m.currentPeriodEnd = end
      } else {
        m = { id: nid('m'), userId, planId, status: 'ACTIVE', currentPeriodEnd: end }
        store.memberships.push(m)
      }
      return m
    },
  },

  orders: {
    async forUser(userId: string) {
      return store.orders
        .filter((o) => o.userId === userId)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    },
    async all() {
      return [...store.orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    },
    async create(input: Omit<Order, 'id' | 'createdAt'>) {
      const order: Order = { ...input, id: nid('o'), createdAt: new Date().toISOString() }
      store.orders.push(order)
      return order
    },
  },

  slots: {
    async available() {
      return store.slots
        .filter((s) => !s.booked && new Date(s.startsAt) > new Date())
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
    },
    async byId(id: string) {
      return store.slots.find((s) => s.id === id) ?? null
    },
  },

  bookings: {
    async forUser(userId: string) {
      return store.bookings
        .filter((b) => b.userId === userId)
        .map((b) => ({ ...b, slot: store.slots.find((s) => s.id === b.slotId)! }))
        .sort((a, b) => +new Date(a.slot.startsAt) - +new Date(b.slot.startsAt))
    },
    async all() {
      return store.bookings
        .map((b) => ({
          ...b,
          slot: store.slots.find((s) => s.id === b.slotId)!,
          user: store.users.find((u) => u.id === b.userId),
        }))
        .sort((a, b) => +new Date(a.slot.startsAt) - +new Date(b.slot.startsAt))
    },
    async create(input: { userId: string; slotId: string; focus: string }) {
      const slot = store.slots.find((s) => s.id === input.slotId)
      if (!slot || slot.booked) return null
      slot.booked = true
      const booking: Booking = {
        id: nid('b'),
        userId: input.userId,
        slotId: input.slotId,
        status: 'CONFIRMED',
        focus: input.focus,
        createdAt: new Date().toISOString(),
      }
      store.bookings.push(booking)
      return booking
    },
    async attachZoom(bookingId: string, zoom: { joinUrl: string; meetingId: string }) {
      const b = store.bookings.find((x) => x.id === bookingId)
      if (!b) return null
      b.zoomJoinUrl = zoom.joinUrl
      b.zoomMeetingId = zoom.meetingId
      return b
    },
    async cancel(bookingId: string, userId: string) {
      const b = store.bookings.find((x) => x.id === bookingId && x.userId === userId)
      if (!b) return false
      b.status = 'CANCELED'
      const slot = store.slots.find((s) => s.id === b.slotId)
      if (slot) slot.booked = false
      return true
    },
  },

  testimonials: {
    async all() {
      return store.testimonials
    },
  },

  // ------------------------------------------------------------------
  // Métricas para el panel de administración.
  // ------------------------------------------------------------------
  admin: {
    async overview() {
      const paid = store.orders.filter((o) => o.status === 'PAID')
      const revenueCents = paid.reduce((acc, o) => acc + o.amountCents, 0)
      const activeMembers = store.memberships.filter(
        (m) => m.status === 'ACTIVE' && new Date(m.currentPeriodEnd) > new Date(),
      ).length
      return {
        revenueCents,
        totalOrders: paid.length,
        students: store.users.filter((u) => u.role === 'STUDENT').length,
        activeMembers,
        courses: store.courses.length,
        upcomingBookings: store.bookings.filter(
          (b) => b.status === 'CONFIRMED',
        ).length,
      }
    },
    async beltDistribution() {
      const dist: Record<Belt, number> = {
        WHITE: 0, YELLOW: 0, GREEN: 0, BLUE: 0, RED: 0, BLACK: 0,
      }
      for (const u of store.users) if (u.role === 'STUDENT') dist[u.belt]++
      return Object.entries(dist).map(([belt, count]) => ({
        belt: belt as Belt,
        label: BELTS[belt as Belt].label,
        count,
      }))
    },
  },
}

export type DB = typeof db
