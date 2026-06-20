import { hashPassword } from '@/lib/auth/password'
import type {
  AvailabilitySlot,
  Booking,
  Course,
  LessonProgress,
  Membership,
  Order,
  Plan,
  User,
} from '@/lib/types'
import { seedCourses, seedPlans, seedTestimonials, seedUsers, type Testimonial } from './seed'

// =====================================================================
// Store en memoria. Es la implementación "mock" del modelo de datos.
// Se adjunta a globalThis para sobrevivir a los hot-reloads de Next dev.
// En producción (DATA_DRIVER=prisma) este store se sustituye por consultas
// a PostgreSQL — los repositorios de `index.ts` exponen la misma interfaz.
// =====================================================================

export interface Store {
  users: User[]
  courses: Course[]
  plans: Plan[]
  testimonials: Testimonial[]
  progress: LessonProgress[]
  memberships: Membership[]
  orders: Order[]
  slots: AvailabilitySlot[]
  bookings: Booking[]
}

function generateSlots(): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = []
  const now = new Date()
  // Próximos 14 días, turnos a las 17:00, 18:00 y 19:00 (hora local).
  for (let day = 1; day <= 14; day++) {
    for (const hour of [17, 18, 19]) {
      const d = new Date(now)
      d.setDate(now.getDate() + day)
      d.setHours(hour, 0, 0, 0)
      slots.push({
        id: `slot_${day}_${hour}`,
        startsAt: d.toISOString(),
        durationMin: 60,
        capacity: 1,
        booked: false,
      })
    }
  }
  return slots
}

function buildStore(): Store {
  const users: User[] = seedUsers.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    passwordHash: hashPassword(u.password),
    role: u.role,
    belt: u.belt,
    avatarUrl: u.avatarUrl,
    xp: u.xp,
    streakDays: u.streakDays,
    createdAt: new Date().toISOString(),
  }))

  // Membresía activa de ejemplo para el alumno demo.
  const memberships: Membership[] = [
    {
      id: 'm_demo',
      userId: 'u_demo',
      planId: 'plan_pro',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 24).toISOString(),
    },
  ]

  // Algo de progreso e historial para que el dashboard se vea vivo.
  const progress: LessonProgress[] = [
    { userId: 'u_demo', lessonId: 'l_p1_1', completed: true, completedAt: new Date().toISOString() },
    { userId: 'u_demo', lessonId: 'l_p1_2', completed: true, completedAt: new Date().toISOString() },
    { userId: 'u_demo', lessonId: 'l_t_1', completed: true, completedAt: new Date().toISOString() },
    { userId: 'u_demo', lessonId: 'l_f_1', completed: true, completedAt: new Date().toISOString() },
  ]

  const orders: Order[] = [
    {
      id: 'o_1', userId: 'u_demo', type: 'MEMBERSHIP', status: 'PAID',
      amountCents: 1900, currency: 'usd', createdAt: new Date(Date.now() - 6e8).toISOString(),
    },
    {
      id: 'o_2', userId: 'u_demo', type: 'COURSE', status: 'PAID',
      amountCents: 2400, currency: 'usd', courseId: 'c_fuerza_1',
      createdAt: new Date(Date.now() - 3e8).toISOString(),
    },
  ]

  return {
    users,
    courses: structuredClone(seedCourses),
    plans: structuredClone(seedPlans),
    testimonials: seedTestimonials,
    progress,
    memberships,
    orders,
    slots: generateSlots(),
    bookings: [],
  }
}

const globalForStore = globalThis as unknown as { __hstkdStore?: Store }

export const store: Store = globalForStore.__hstkdStore ?? buildStore()
if (process.env.NODE_ENV !== 'production') globalForStore.__hstkdStore = store
