import type { User } from '@/features/auth/model/auth.types'
import type { Movie } from '@/features/movies/model/movie.types'

export function bookingEligibilityError(
  user: User | null,
  rating: Movie['ageRating'],
): string | null {
  if (!user) return 'Log in to buy tickets.'
  if (!user.profileComplete || user.age == null)
    return 'Your profile is still incomplete. Please fill in all required information.'
  if (user.age < rating.minAge)
    return `This film is rated ${rating.code}. You cannot buy tickets for it with this account.`
  return null
}
