import { useNavigate } from 'react-router'
import { useState } from 'react'
import type { User } from '@/features/auth/model/auth.types'
import { useAuth } from '@/features/auth/session/auth-context'
import type { Session } from '../model/session.types'

export function useSessionSelection() {
  const { user, openLogin } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  function select(session: Session) {
    if (session.isSoldOut) return
    setMessage(null)
    const destination = `/movies/${encodeURIComponent(session.movie.slug)}?session=${session.id}`
    function continueSelection(account: User) {
      if (account.age != null && account.age < session.movie.ageRating.minAge) {
        setMessage(
          `This film is rated ${session.movie.ageRating.code}. You cannot buy tickets for it with this account.`,
        )
        return
      }
      if (!account.profileComplete) {
        const params = new URLSearchParams({
          returnTo: destination,
          minAge: String(session.movie.ageRating.minAge),
          rating: session.movie.ageRating.code,
        })
        navigate(`/profile?${params}`)
        return
      }
      if (account.age == null) {
        setMessage('Unable to verify your age. Please update your date of birth in your profile.')
        return
      }
      navigate(destination)
    }
    if (user) continueSelection(user)
    else {
      // Authentication already returns the authoritative account from the API.
      openLogin(async (_token, account) => continueSelection(account))
    }
  }
  return { select, message }
}
