import type { MovieShowtime } from '../api/movie-detail'
import styles from './MovieShowtimes.module.scss'
import { useSessionSelection } from '@/features/sessions/hooks/useSessionSelection'
import type { MovieDetail } from '../api/movie-detail'
import { useAuth } from '@/features/auth/session/auth-context'
import { useSessionStarted } from '@/features/sessions/hooks/useSessionStarted'

export function ShowtimeCard({ session, movie }: { session: MovieShowtime; movie: MovieDetail }) {
  const { select, message } = useSessionSelection()
  const { user } = useAuth()
  const blocked = user?.age != null && user.age < movie.ageRating.minAge
  const started = useSessionStarted(session.startsAt)
  return (
    <div>
      <button
        type="button"
        disabled={started || session.isSoldOut || blocked}
        title={
          started
            ? 'Session started'
            : blocked
              ? `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`
              : undefined
        }
        onClick={() => select({ ...session, movie })}
        className={styles.ticket}
        aria-label={`${session.time}, ${session.language.name}, ${session.format.name}, ${started ? 'Session started' : session.isSoldOut ? 'Sold out' : `${session.seatsLeft} seats left`}`}
      >
        <div>
          <strong>{session.time}</strong>
          <p>
            <span title={session.language.name}>{session.language.code}</span>
            <span className={styles.format}>{session.format.name}</span>
          </p>
        </div>
        <div>
          <strong className={styles.price}>₾ {session.price}</strong>
          <p className={started ? styles.started : undefined}>
            {!started && !session.isSoldOut && (
              <img src="/assets/kino/seats-available.svg" alt="" />
            )}
            {started
              ? 'Session started'
              : session.isSoldOut
                ? 'Sold out'
                : `${session.seatsLeft} left`}
          </p>
        </div>
      </button>
      {message && <p role="alert">{message}</p>}
    </div>
  )
}
