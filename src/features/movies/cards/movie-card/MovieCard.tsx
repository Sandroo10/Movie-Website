import { useState } from 'react'
import { Link } from 'react-router'
import type { Movie } from '@/features/movies/model/movie.types'
import styles from './MovieCard.module.scss'

export function MovieCard({ movie }: { movie: Movie }) {
  const [failedPoster, setFailedPoster] = useState<string | null>(null)

  return (
    <Link to={`/movies/${movie.slug}`} className={styles.card}>
      {movie.posterUrl && failedPoster !== movie.posterUrl ? (
        <img
          className={styles.poster}
          src={movie.posterUrl}
          alt=""
          loading="lazy"
          draggable={false}
          onError={() => setFailedPoster(movie.posterUrl)}
        />
      ) : (
        <span className={styles.poster}>Poster unavailable</span>
      )}
      <div className={styles.details}>
        <h3 title={movie.title}>{movie.title}</h3>
        <p className={styles.metadata}>
          {movie.genres[0] && `${movie.genres[0].name} · `}
          {movie.runtimeMinutes} min
        </p>
        <span className={styles.age}>{movie.ageRating.code}</span>
      </div>
      <div className={styles.footer}>
        <span className={styles.price}>From ₾ {movie.fromPrice}</span>
        <span className={styles.buy}>Buy Ticket</span>
      </div>
    </Link>
  )
}
