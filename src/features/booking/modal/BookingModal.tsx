import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { useAuthDialog } from '@/features/auth/modal/hooks/useAuthDialog'
import { useAuth } from '@/features/auth/session/auth-context'
import type { Session } from '@/features/sessions/model/session.types'
import type { FilterOptions } from '@/features/venues/api/filter-options'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import { useBookingFlow } from '../hooks/useBookingFlow'
import { useHoldTimer } from '../hooks/useHoldTimer'
import { SeatMap } from '../seats/SeatMap'
import { SeatSummary } from '../seats/SeatSummary'
import { CheckoutForm } from '../checkout/CheckoutForm'
import { OrderSummary } from '../checkout/OrderSummary'
import { BookingConfirmation } from '../confirmation/BookingConfirmation'
import styles from './BookingModal.module.scss'
import { RefreshIndicator } from '@/components/ui/refresh-indicator/RefreshIndicator'

export function BookingModal({
  session,
  options,
  open,
  onClose,
  onPending,
  onOrder,
}: {
  session: Session
  options: FilterOptions
  open: boolean
  onClose: () => void
  onPending: (pending: boolean) => void
  onOrder: () => void
}) {
  const dialog = useAuthDialog(open)
  const { user } = useAuth()
  const flow = useBookingFlow(session, options, onClose)
  const timer = useHoldTimer(flow.hold?.expiresAt, flow.expireHold)
  useEffect(() => onPending(flow.pending), [flow.pending, onPending])
  useEffect(() => {
    if (flow.order) onOrder()
  }, [flow.order, onOrder])
  return createPortal(
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="booking-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose()
      }}
    >
      <button type="button" className={styles.close} aria-label="Close booking" onClick={onClose}>
        ×
      </button>
      {flow.order ? (
        <BookingConfirmation order={flow.order} onClose={onClose} />
      ) : (
        <>
          <header className={styles.heading}>
            <div>
              <h2 id="booking-title">{session.movie.title}</h2>
              <p>
                {session.venue.name} · Hall {session.hall.name} · {session.date} · {session.time} ·{' '}
                {session.format.name} · {session.language.name}
              </p>
            </div>
            {flow.hold && (
              <div className={styles.timer}>
                <span>SEATS HELD</span>
                <strong role="timer">{timer}</strong>
              </div>
            )}
          </header>
          {flow.message && (
            <p className={styles.warning} role="alert">
              {flow.message}
            </p>
          )}
          {flow.seats.isFetching && !flow.seats.isPending && (
            <RefreshIndicator label="Refreshing seat availability…" />
          )}
          {flow.fieldErrors.seats && (
            <p className={styles.warning} role="alert">
              {flow.fieldErrors.seats.join(' ')}
            </p>
          )}
          <div className={styles.layout}>
            <div className={styles.main}>
              <div className={styles.progress}>
                <span aria-current={!flow.checkout ? 'step' : undefined}>SEATS</span>
                <span aria-current={flow.checkout ? 'step' : undefined}>CHECKOUT</span>
              </div>
              {flow.pending && (
                <p role="status" className={styles.warning}>
                  {flow.operation === 'payment'
                    ? 'Your payment request is processing. Its result will appear even if you close this window.'
                    : 'Holding your selected seats…'}
                </p>
              )}
              {flow.started ? (
                <FeedbackState
                  message="Session started. Booking is no longer available for this showtime."
                  onAction={onClose}
                  actionLabel="Close"
                />
              ) : flow.checkout && flow.hold && user ? (
                <CheckoutForm
                  user={user}
                  pending={flow.pending}
                  errors={flow.fieldErrors}
                  onPay={flow.pay}
                  onBack={flow.back}
                />
              ) : flow.seats.isPending ? (
                <SkeletonGroup label="Loading hall map">
                  <Skeleton height={340} radius={18} />
                </SkeletonGroup>
              ) : flow.seats.isError ? (
                <FeedbackState
                  error
                  message="Unable to load the hall map."
                  onAction={() => void flow.seats.refetch()}
                />
              ) : (
                flow.seats.data && (
                  <SeatMap
                    map={flow.seats.data}
                    selection={flow.selection}
                    contested={flow.contested}
                    pending={flow.pending}
                    onToggle={flow.toggle}
                  />
                )
              )}
            </div>
            {flow.started ? null : flow.checkout && flow.hold ? (
              <OrderSummary session={session} hold={flow.hold} />
            ) : (
              <SeatSummary
                selected={flow.selected}
                session={session}
                options={options}
                subtotal={flow.subtotal}
                pending={flow.pending}
                invalid={flow.invalid || flow.seats.isError || flow.seats.isPending}
                onRemove={flow.toggle}
                onType={flow.ticketType}
                onNext={() => void flow.next()}
                errors={flow.fieldErrors}
              />
            )}
          </div>
          <button type="button" className={styles.closeText} onClick={onClose}>
            Close
          </button>
        </>
      )}
    </dialog>,
    document.body,
  )
}
