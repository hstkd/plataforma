import { BELTS } from './brand'
import type { Course, PublicUser } from './types'

export type AccessDecision = {
  canAccess: boolean
  reason: 'FREE' | 'MEMBERSHIP_OK' | 'PURCHASED' | 'NEEDS_MEMBERSHIP' | 'NEEDS_PURCHASE' | 'NEEDS_LOGIN'
  beltLocked: boolean
}

/**
 * Decide si un usuario puede ver el contenido completo de un curso.
 * `hasMembership` y `purchasedCourseIds` se resuelven en el servidor.
 */
export function evaluateAccess(
  course: Course,
  user: PublicUser | null,
  ctx: { hasMembership: boolean; purchasedCourseIds: string[] },
): AccessDecision {
  const beltLocked = user
    ? BELTS[user.belt].level < BELTS[course.requiredBelt].level
    : BELTS[course.requiredBelt].level > 0

  if (course.access === 'FREE') {
    return { canAccess: true, reason: 'FREE', beltLocked: false }
  }

  if (!user) {
    return { canAccess: false, reason: 'NEEDS_LOGIN', beltLocked }
  }

  if (course.access === 'PURCHASE') {
    if (ctx.purchasedCourseIds.includes(course.id) || ctx.hasMembership) {
      return { canAccess: true, reason: 'PURCHASED', beltLocked }
    }
    return { canAccess: false, reason: 'NEEDS_PURCHASE', beltLocked }
  }

  // MEMBERSHIP
  if (ctx.hasMembership) {
    return { canAccess: true, reason: 'MEMBERSHIP_OK', beltLocked }
  }
  return { canAccess: false, reason: 'NEEDS_MEMBERSHIP', beltLocked }
}
