import type { MovieShowtime } from '../api/movie-detail'
import styles from './MovieShowtimes.module.scss'

export function ShowtimeCard({ session }: { session: MovieShowtime }) {
  return (
    <article
      className={styles.ticket}
      aria-label={`${session.time}, ${session.language.name}, ${session.format.name}, ${session.isSoldOut ? 'Sold out' : `${session.seatsLeft} seats left`}`}
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
        <p>
          {!session.isSoldOut && <img src="/assets/kino/seats-available.svg" alt="" />}
          {session.isSoldOut ? 'Sold out' : `${session.seatsLeft} left`}
        </p>
      </div>
    </article>
  )
}
