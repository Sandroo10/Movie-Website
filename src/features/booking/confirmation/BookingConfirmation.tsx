import { Link } from 'react-router'
import type { BookingOrder } from '../model/booking.types'
import styles from '../modal/BookingModal.module.scss'
export function BookingConfirmation({
  order,
  onClose,
}: {
  order: BookingOrder
  onClose: () => void
}) {
  return (
    <div className={styles.confirmation}>
      <span className={styles.check} aria-hidden="true">
        ✓
      </span>
      <h2 id="booking-title">Booking confirmed!</h2>
      <p>Your tickets are ready.</p>
      <span className={styles.reference}>ORDER #{order.reference}</span>
      <div className={styles.confirmationCard}>
        <h3>{order.session.movie.title}</h3>
        <p>
          {order.session.venue.name} · Hall {order.session.hall.name} · {order.session.date} ·{' '}
          {order.session.time}
        </p>
        {order.tickets.map((ticket) => (
          <div className={styles.line} key={ticket.id}>
            <span>
              {ticket.seatCode} · {ticket.ticketType.name}
            </span>
            <strong>₾{ticket.price.toFixed(2)}</strong>
          </div>
        ))}
        <div className={styles.total}>
          <span>TOTAL PAID</span>
          <strong>₾{order.totalPrice.toFixed(2)}</strong>
        </div>
      </div>
      <div className={styles.formActions}>
        <Link className={styles.primary} to="/profile?tab=tickets" onClick={onClose}>
          View my tickets
        </Link>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
