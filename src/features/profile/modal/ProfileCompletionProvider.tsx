import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { useAuth } from '@/features/auth/session/auth-context'
import type { User } from '@/features/auth/model/auth.types'
import type { Session } from '@/features/sessions/model/session.types'
import { hasSessionStarted } from '@/features/sessions/hooks/useSessionStarted'
import { useAuthDialog } from '@/features/auth/modal/hooks/useAuthDialog'
import { PersonalInformation } from '../personal-information/PersonalInformation'
import { ProfileCompletionContext } from './profile-completion-context'
import styles from './ProfileCompletionProvider.module.scss'
import { bookingEligibilityError } from '@/features/booking/model/booking-eligibility'

type CompletionRequest = { session: Session; owner: number; onCancel?: () => void }

export function ProfileCompletionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState<CompletionRequest | null>(null)
  const current = useRef<CompletionRequest | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const dialog = useAuthDialog(Boolean(request && user?.id === request.owner))
  const requestCompletion = useCallback(
    (session: Session, owner: number, onCancel?: () => void) => {
      const next = { session, owner, onCancel }
      current.current = next
      setRequest(next)
      setMessage(null)
    },
    [],
  )

  function close() {
    const cancelled = current.current
    current.current = null
    setRequest(null)
    setMessage(null)
    cancelled?.onCancel?.()
  }

  useEffect(() => {
    if (!user || !current.current) return
    if (current.current.owner !== user.id) {
      const cancelled = current.current
      current.current = null
      setRequest(null)
      cancelled.onCancel?.()
    }
  }, [user])

  function saved(updated: User, submitted: CompletionRequest) {
    // Closing the modal cancels navigation even if the save finishes afterward.
    if (current.current !== submitted || updated.id !== submitted.owner) return
    const { session } = submitted
    const eligibilityError = bookingEligibilityError(updated, session.movie.ageRating)
    if (eligibilityError) {
      setMessage(eligibilityError)
      return
    }
    if (hasSessionStarted(session.startsAt)) {
      setMessage('Session started. Please choose another session.')
      return
    }
    current.current = null
    setRequest(null)
    navigate(`/movies/${encodeURIComponent(session.movie.slug)}?session=${session.id}`)
  }

  return (
    <ProfileCompletionContext.Provider value={{ requestCompletion }}>
      {children}
      {createPortal(
        <dialog
          ref={dialog}
          className={styles.dialog}
          aria-labelledby="completion-title"
          aria-describedby="completion-description"
          onCancel={(event) => {
            event.preventDefault()
            close()
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return
            const bounds = event.currentTarget.getBoundingClientRect()
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              close()
          }}
        >
          <div className={styles.heading}>
            <h2 id="completion-title">Complete your profile</h2>
            <button type="button" aria-label="Close profile" onClick={close}>
              <img src="/assets/kino/close.svg" alt="" />
            </button>
          </div>
          <p id="completion-description" className={styles.description}>
            Complete your profile to buy tickets. Your selected session will continue after saving.
          </p>
          {message && (
            <p className={styles.error} role="alert">
              {message}
            </p>
          )}
          {request && user?.id === request.owner && (
            <PersonalInformation
              key={`${request.owner}-${request.session.id}`}
              user={user}
              onSaved={(updated) => saved(updated, request)}
            />
          )}
          <button type="button" className={styles.close} onClick={close}>
            Close
          </button>
        </dialog>,
        document.body,
      )}
    </ProfileCompletionContext.Provider>
  )
}
