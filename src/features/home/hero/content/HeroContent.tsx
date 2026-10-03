import { Link } from 'react-router'
import type { Movie } from '@/features/movies/model/movie.types'
import styles from './HeroContent.module.scss'

export function HeroContent({ movie }: { movie: Movie }) {
  const release = new Date(`${movie.releaseDate}T12:00:00`)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    .toUpperCase()

  return (
    <div className={styles.content}>
      <span className={styles.premiere}>PREMIERE · WEEK OF {release}</span>
      <h1>{movie.title}</h1>
      <div className={styles.badges}>
        <span className={styles.age}>{movie.ageRating.code}</span>
        <span className={styles.badge}>
          <img src="/assets/kino/timer.svg" alt="" />
          {movie.runtimeMinutes} Min
        </span>
        {movie.formats.map((format) => (
          <span className={styles.badge} key={format.id}>
            {format.name}
          </span>
        ))}
      </div>
      {movie.synopsis && <p className={styles.synopsis}>{movie.synopsis}</p>}
      <div className={styles.actions}>
        <Link className={styles.buyTickets} to={`/movies/${movie.slug}`}>
          <img src="/assets/kino/ticket.svg" alt="" />
          Buy tickets
        </Link>
        <Link className={styles.allSessions} to="/sessions">
          All sessions
        </Link>
      </div>
    </div>
  )
}
