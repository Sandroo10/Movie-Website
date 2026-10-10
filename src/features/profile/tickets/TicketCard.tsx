import { useState } from 'react'
import type { TicketOrder } from '../model/ticket.types'
import { useTicketRefund } from '../hooks/useTicketRefund'
import { useRefundAvailability } from '../hooks/useRefundAvailability'
import { refundDeadline, sessionDate, ticketPrice } from './ticket-format'
import styles from './TicketCard.module.scss'

export function TicketCard({ order }: { order: TicketOrder }) {
  const { session, tickets } = order
  const { movie } = session
  const [confirming, setConfirming] = useState(false)
  const { refund, pending, error, clearError } = useTicketRefund(order)
  const refundable = useRefundAvailability(order.isRefundable, session.startsAt)
  const reason = 'Refunds close 2 hours before the session starts.'
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        {movie.posterUrl ? (
          <img className={styles.poster} src={movie.posterUrl} alt={`${movie.title} poster`} />
        ) : (
          <div className={styles.posterFallback}>No poster</div>
        )}
        <div className={styles.details}>
          <div className={styles.title}>
            <h2>{movie.title}</h2>
            <span className={styles.age}>{movie.ageRating.code}</span>
            <span className={styles.runtime}>{movie.runtimeMinutes} min</span>
          </div>
          <dl className={styles.meta}>
            <div>
              <dt>Date</dt>
              <dd>{sessionDate(session.startsAt)}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>
                {session.venue.name} · Hall {session.hall.name}
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>
                {session.format.name} · {session.language.name}
              </dd>
            </div>
          </dl>
          <div className={styles.seats}>
            <span>Seats</span>
            {tickets.map((ticket) => (
              <span className={styles.seat} key={ticket.id}>
                {ticket.seatCode} · {ticket.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.stub}>
        <div className={styles.order}>
          <span>Order</span>
          <strong>#{order.reference}</strong>
        </div>
        <div className={styles.total}>
          <span>Total paid</span>
          <strong>{ticketPrice(order.totalPrice)}</strong>
        </div>
        {order.isUpcoming && (
          <>
            {confirming && (refundable || pending) ? (
              <div className={styles.confirmation}>
                <p>Refund this order? All its seats will be released.</p>
                <div>
                  <button
                    type="button"
                    disabled={!refundable || pending}
                    onClick={() => void refund()}
                  >
                    {pending ? 'Refunding…' : 'Confirm refund'}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setConfirming(false)
                      clearError()
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.refund}
                type="button"
                disabled={!refundable || pending}
                title={!refundable ? reason : undefined}
                onClick={() => {
                  clearError()
                  setConfirming(true)
                }}
              >
                {pending ? 'Refunding…' : 'Refund'}
              </button>
            )}
            <p className={styles.deadline}>
              {refundable ? `Refundable until ${refundDeadline(session.startsAt)}` : reason}
            </p>
          </>
        )}
        {order.status === 'refunded' && <p className={styles.deadline}>Refunded</p>}
        {error && (
          <p className={styles.error} role="alert">
            {error.message}
          </p>
        )}
      </div>
    </article>
  )
}
