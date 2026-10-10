import type { Session } from '@/features/sessions/model/session.types'
import type { SeatHold } from '../model/booking.types'
import styles from '../modal/BookingModal.module.scss'
export function OrderSummary({ session, hold }: { session: Session; hold: SeatHold }) {
  return (
    <aside className={styles.summary}>
      <h3>Summary</h3>
      <div className={styles.summaryCard}>
        <h3>{session.movie.title}</h3>
        <p>
          Hall {session.hall.name} · {session.date} · {session.time}
        </p>
        {hold.seats.map((seat) => (
          <div className={styles.line} key={seat.seatId}>
            <span>
              {seat.code} · {seat.ticketType.name}
            </span>
            <strong>₾{seat.price.toFixed(2)}</strong>
          </div>
        ))}
      </div>
      <div className={styles.summaryFooter}>
        <div className={styles.total}>
          <span>SUBTOTAL</span>
          <strong>₾{hold.subtotal.toFixed(2)}</strong>
        </div>
      </div>
    </aside>
  )
}
