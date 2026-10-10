import type { Session } from '../model/session.types'
import styles from './SessionCard.module.scss'

export function SessionCard({
  session,
  blocked,
  onSelect,
}: {
  session: Session
  blocked?: string
  onSelect: (session: Session) => void
}) {
  const soldOut = session.isSoldOut
  const low = session.seatsLeft < 10
  return (
    <button
      type="button"
      className={styles.card}
      disabled={soldOut || Boolean(blocked)}
      title={blocked || (soldOut ? 'This session is sold out.' : undefined)}
      aria-label={`${session.time}, ${session.venue.name}, Hall ${session.hall.name}, ${session.format.name}, ${session.language.name}, from ₾${session.price}, ${soldOut ? 'Sold out' : `${session.seatsLeft} seats left`}`}
      onClick={() => onSelect(session)}
    >
      <span className={styles.top}>
        <strong>{session.time}</strong>
        <span className={styles.format}>{session.format.name}</span>
      </span>
      <span className={styles.bottom}>
        <span className={styles.details}>
          <span>{session.language.name}</span>
          <strong>
            {session.venue.name} · Hall {session.hall.name}
          </strong>
        </span>
        <span className={styles.price}>
          <span className={`${styles.seats} ${low ? styles.low : ''}`}>
            {!soldOut && <img src={`/assets/kino/seats-${low ? 'low' : 'available'}.svg`} alt="" />}
            {soldOut ? 'Sold out' : `${session.seatsLeft} left`}
          </span>
          <strong>₾{session.price}</strong>
        </span>
      </span>
    </button>
  )
}
