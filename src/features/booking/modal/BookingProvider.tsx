import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/features/auth/session/auth-context'
import type { Session } from '@/features/sessions/model/session.types'
import type { FilterOptions } from '@/features/venues/api/filter-options'
import { BookingContext } from './booking-context'
import { BookingModal } from './BookingModal'
import styles from './BookingProvider.module.scss'
import { bookingEligibilityError } from '../model/booking-eligibility'

type ActiveBooking = {
  session: Session
  options: FilterOptions
  owner: number
  onDismiss: () => void
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [active, setActive] = useState<ActiveBooking | null>(null)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const busy = useRef(false)
  const reportPending = useCallback((value: boolean) => {
    busy.current = value
    setPending(value)
  }, [])
  const revealResult = useCallback(() => {
    setConfirmed(true)
    setOpen(true)
  }, [])
  const showBooking = useCallback(
    (session: Session, options: FilterOptions, onDismiss: () => void) => {
      if (!user || bookingEligibilityError(user, session.movie.ageRating)) return
      // A second session must not replace an operation that is still in flight.
      if (!busy.current) {
        setConfirmed(false)
        setActive((previous) =>
          previous?.session.id === session.id && previous.owner === user.id
            ? previous
            : { session, options, owner: user.id, onDismiss },
        )
      }
      setOpen(true)
    },
    [user],
  )
  function close() {
    setOpen(false)
    active?.onDismiss()
    // Keep the flow mounted while its request settles, even after navigation.
    if (!busy.current) setActive(null)
  }
  const sameAccount = active?.owner === user?.id
  const eligible = Boolean(active && !bookingEligibilityError(user, active.session.movie.ageRating))
  return (
    <BookingContext.Provider value={{ showBooking }}>
      {children}
      {active && !open && sameAccount && (eligible || confirmed) && (
        <div className={styles.notice} role="status">
          <span>
            {pending
              ? 'Your booking request is still processing…'
              : 'Your booking request finished. Open booking to review the result.'}
          </span>
          <button type="button" onClick={() => setOpen(true)}>
            Open booking
          </button>
        </div>
      )}
      {active && (
        <BookingModal
          key={`${active.owner}-${active.session.id}`}
          session={active.session}
          options={active.options}
          open={open && sameAccount && (eligible || confirmed)}
          onClose={close}
          onPending={reportPending}
          onOrder={revealResult}
        />
      )}
    </BookingContext.Provider>
  )
}
