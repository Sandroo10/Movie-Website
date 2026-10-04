import { Link } from 'react-router'
import type { RecentMovie } from '../../history/recent-movie.types'
import styles from './RecentMovieCard.module.scss'

export function RecentMovieCard({ movie }: { movie: RecentMovie }) {
  return (
    <Link to={`/movies/${movie.slug}`} className={styles.recentCard}>
      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt="" loading="lazy" />
      ) : (
        <span className={styles.posterFallback}>Poster unavailable</span>
      )}
      <div>
        <strong>{movie.title}</strong>
        <p>
          {movie.genre && `${movie.genre} · `}
          {movie.runtimeMinutes} min
        </p>
        <span className={styles.age}>{movie.ageRating}</span>
      </div>
    </Link>
  )
}
