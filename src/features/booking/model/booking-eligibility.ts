import type { User } from '@/features/auth/model/auth.types'
import type { Session } from '@/features/sessions/model/session.types'
import { hasSessionStarted } from '@/features/sessions/hooks/useSessionStarted'

type Eligibility =
  | { allowed: true }
  | {
      allowed: false
      reason: 'started' | 'coming-soon' | 'sold-out' | 'login' | 'profile' | 'age'
      message: string
    }

export function bookingEligibility(
  user: User | null,
  session: Session,
  { checkAvailability = true, allowSoldOut = false } = {},
): Eligibility {
  if (checkAvailability) {
    if (hasSessionStarted(session.startsAt))
      return {
        allowed: false,
        reason: 'started',
        message: 'Session started. Booking is no longer available for this showtime.',
      }
    if (session.movie.isComingSoon)
      return {
        allowed: false,
        reason: 'coming-soon',
        message: 'Sessions will be announced when this title opens.',
      }
    if (session.isSoldOut && !allowSoldOut)
      return {
        allowed: false,
        reason: 'sold-out',
        message: 'This session is sold out. Please choose another session.',
      }
  }
  if (!user) return { allowed: false, reason: 'login', message: 'Log in to buy tickets.' }
  if (!user.profileComplete || user.age == null)
    return { allowed: false, reason: 'profile', message: 'Complete your profile to buy tickets.' }
  if (user.age < session.movie.ageRating.minAge)
    return {
      allowed: false,
      reason: 'age',
      message: `This film is rated ${session.movie.ageRating.code}. You cannot buy tickets for it with this account.`,
    }
  return { allowed: true }
}
