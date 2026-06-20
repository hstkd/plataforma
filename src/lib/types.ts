// =====================================================================
// Tipos del dominio — reflejan prisma/schema.prisma
// =====================================================================

export type Role = 'STUDENT' | 'ADMIN'

export type Belt = 'WHITE' | 'YELLOW' | 'GREEN' | 'BLUE' | 'RED' | 'BLACK'

export type Category =
  | 'POOMSAE'
  | 'COMBATE'
  | 'TECNICA'
  | 'FLEXIBILIDAD'
  | 'FUERZA'
  | 'VELOCIDAD'
  | 'MENTAL'

export type AccessType = 'FREE' | 'MEMBERSHIP' | 'PURCHASE'

export type PlanInterval = 'MONTH' | 'YEAR'

export type MembershipStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED'

export type OrderType = 'COURSE' | 'PRIVATE_CLASS' | 'MEMBERSHIP'

export type OrderStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED'

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  role: Role
  belt: Belt
  avatarUrl?: string
  xp: number
  streakDays: number
  createdAt: string
}

/** Usuario sin datos sensibles, seguro para enviar al cliente. */
export type PublicUser = Omit<User, 'passwordHash'>

export interface Drill {
  id: string
  name: string
  reps: string
  notes?: string
}

export interface Lesson {
  id: string
  order: number
  title: string
  videoUrl: string
  description: string
  durationSec: number
  drills: Drill[]
}

export interface Course {
  id: string
  slug: string
  title: string
  category: Category
  summary: string
  description: string
  coverUrl: string
  trailerUrl?: string
  requiredBelt: Belt
  access: AccessType
  priceCents: number
  durationMin: number
  published: boolean
  lessons: Lesson[]
}

export interface LessonProgress {
  userId: string
  lessonId: string
  completed: boolean
  completedAt?: string
}

export interface Plan {
  id: string
  slug: string
  name: string
  priceCents: number
  interval: PlanInterval
  features: string[]
  highlighted: boolean
  stripePriceId?: string
}

export interface Membership {
  id: string
  userId: string
  planId: string
  status: MembershipStatus
  currentPeriodEnd: string
}

export interface Order {
  id: string
  userId: string
  type: OrderType
  status: OrderStatus
  amountCents: number
  currency: string
  courseId?: string
  createdAt: string
}

export interface AvailabilitySlot {
  id: string
  startsAt: string
  durationMin: number
  capacity: number
  booked: boolean
}

export interface Booking {
  id: string
  userId: string
  slotId: string
  status: BookingStatus
  focus: string
  zoomJoinUrl?: string
  zoomMeetingId?: string
  createdAt: string
}
