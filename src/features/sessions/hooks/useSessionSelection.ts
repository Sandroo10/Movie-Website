import { useNavigate } from 'react-router'
import { useState } from 'react'
import type { User } from '@/features/auth/model/auth.types'
import { useAuth } from '@/features/auth/session/auth-context'
import type { Session } from '../model/session.types'
import { bookingEligibility } from '@/features/booking/model/booking-eligibility'
import { useProfileCompletion } from '@/features/profile/modal/profile-completion-context'

export function useSessionSelection() {
  const { user, openLogin } = useAuth()
  const navigate = useNavigate()
  const { requestCompletion } = useProfileCompletion()
  const [message, setMessage] = useState<string | null>(null)
  function select(session: Session) {
    setMessage(null)
    const destination = `/movies/${encodeURIComponent(session.movie.slug)}?session=${session.id}`
    function continueSelection(account: User | null) {
      const eligibility = bookingEligibility(account, session)
      if (!eligibility.allowed) {
        if (eligibility.reason === 'login')
          openLogin((_token, signedIn) => {
            continueSelection(signedIn)
            return Promise.resolve()
          })
        else if (eligibility.reason === 'profile' && account) requestCompletion(session, account.id)
        else setMessage(eligibility.message)
        return
      }
      void navigate(destination)
    }
    continueSelection(user)
  }
  return { select, message }
}
