import { useNavigate } from 'react-router'
import { useState } from 'react'
import type { User } from '@/features/auth/model/auth.types'
import { useAuth } from '@/features/auth/session/auth-context'
import type { Session } from '../model/session.types'
import { hasSessionStarted } from './useSessionStarted'
import { useProfileCompletion } from '@/features/profile/modal/profile-completion-context'

export function useSessionSelection() {
  const { user, openLogin } = useAuth()
  const navigate = useNavigate()
  const { requestCompletion } = useProfileCompletion()
  const [message, setMessage] = useState<string | null>(null)
  function select(session: Session) {
    if (hasSessionStarted(session.startsAt)) {
      setMessage('Session started')
      return
    }
    if (session.isSoldOut) return
    setMessage(null)
    const destination = `/movies/${encodeURIComponent(session.movie.slug)}?session=${session.id}`
    function continueSelection(account: User) {
      if (hasSessionStarted(session.startsAt)) {
        setMessage('Session started')
        return
      }
      if (account.age != null && account.age < session.movie.ageRating.minAge) {
        setMessage(
          `This film is rated ${session.movie.ageRating.code}. You cannot buy tickets for it with this account.`,
        )
        return
      }
      if (!account.profileComplete) {
        requestCompletion(session, account.id)
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
