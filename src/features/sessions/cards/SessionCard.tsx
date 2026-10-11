import type { Session } from '../model/session.types'
import styles from './SessionCard.module.scss'
import { useSessionStarted } from '../hooks/useSessionStarted'

type SessionCardProps = Readonly<{
  session: Session
  blocked?: string
  onSelect: (session: Session) => void
}>

export function SessionCard({ session, blocked, onSelect }: SessionCardProps) {
  const soldOut = session.isSoldOut
  const started = useSessionStarted(session.startsAt)
  const low = session.seatsLeft < 10
  let title = blocked
  let availabilityLabel = `${session.seatsLeft} seats left`
  let availabilityText = `${session.seatsLeft} left`

  if (started) {
    title = 'Session started'
    availabilityLabel = 'Session started'
    availabilityText = 'Session started'
  } else if (soldOut) {
    title = blocked || 'This session is sold out.'
    availabilityLabel = 'Sold out'
    availabilityText = 'Sold out'
  }

  const accessibleLabel = `${session.time}, ${session.venue.name}, Hall ${session.hall.name}, ${session.format.name}, ${session.language.name}, from ₾${session.price}, ${availabilityLabel}`
  return (
    <button
      type="button"
      className={styles.card}
      disabled={started || soldOut || Boolean(blocked)}
      title={title}
      aria-label={accessibleLabel}
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
            {!started && !soldOut && (
              <img src={`/assets/kino/seats-${low ? 'low' : 'available'}.svg`} alt="" />
            )}
            {availabilityText}
          </span>
          <strong>from ₾{session.price}</strong>
        </span>
      </span>
    </button>
  )
}
