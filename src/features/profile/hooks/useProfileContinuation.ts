import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import type { User } from '@/features/auth/model/auth.types'

export function useProfileContinuation(user: User | null) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const destination = params.get('returnTo')
  const minimumAge = params.get('minAge') ?? ''
  const rating = params.get('rating') ?? 'age-restricted'
  // Only allow the existing movie/session route, never arbitrary or external URLs.
  const valid = Boolean(
    destination &&
      /^\/movies\/[a-zA-Z0-9_%~-]+\?session=\d+$/.test(destination) &&
      /^\d{1,2}$/.test(minimumAge),
  )
  const blocked = Boolean(
    valid && user?.profileComplete && user.age != null && user.age < Number(minimumAge),
  )
  useEffect(() => {
    if (valid && user?.profileComplete && user.age != null && !blocked && destination) {
      navigate(destination, { replace: true })
    }
  }, [valid, user?.profileComplete, user?.age, blocked, destination, navigate])
  if (!valid || !user) return null
  if (user.profileComplete && user.age == null)
    return 'Unable to verify your age. Please update your date of birth before continuing.'
  return blocked
    ? `Your profile is complete, but this film is rated ${rating}. You cannot buy tickets for it with this account. Choose another session.`
    : !user.profileComplete
      ? 'Complete your profile to continue to your selected session.'
      : null
}
