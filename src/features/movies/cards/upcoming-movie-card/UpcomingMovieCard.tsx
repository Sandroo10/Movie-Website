import { useState } from 'react'
import { Link } from 'react-router'
import type { Movie } from '@/features/movies/model/movie.types'
import { useMovieNotification } from '@/features/movies/hooks/useMovieNotification'
import styles from './UpcomingMovieCard.module.scss'

export function UpcomingMovieCard({ movie }: { movie: Movie }) {
  const [failedPoster, setFailedPoster] = useState<string | null>(null)
  const notification = useMovieNotification(movie.slug)
  const release = new Date(`${movie.releaseDate}T12:00:00`)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    .toUpperCase()
  const subscribed = movie.isNotified || notification.subscribed
  const movieUrl = `/movies/${movie.slug}`

  return (
    <div>
      <article className={styles.card} aria-label={movie.title}>
        <Link className={styles.poster} to={movieUrl} aria-label={`View ${movie.title}`}>
          {movie.posterUrl && failedPoster !== movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt=""
              loading="lazy"
              draggable={false}
              onError={() => setFailedPoster(movie.posterUrl)}
            />
          ) : (
            <span>Poster unavailable</span>
          )}
        </Link>
        <div className={styles.copy}>
          <div className={styles.details}>
            <p className={styles.release}>IN CINEMAS {release}</p>
            <Link className={styles.title} to={movieUrl} title={movie.title}>
              {movie.title}
            </Link>
            <p className={styles.metadata}>
              {movie.genres[0] && `${movie.genres[0].name} · `}
              {movie.runtimeMinutes} min
            </p>
            <span className={styles.age}>{movie.ageRating.code}</span>
          </div>
          <button
            className={styles.notify}
            type="button"
            disabled={notification.pending || subscribed}
            onClick={notification.notify}
            aria-describedby={notification.message ? `notification-${movie.id}` : undefined}
          >
            <img src="/assets/kino/notify.svg" alt="" />
            {notification.pending ? 'Please wait…' : subscribed ? 'Subscribed' : 'Notify Me'}
          </button>
        </div>
      </article>
      {notification.message && (
        <p className={styles.message} id={`notification-${movie.id}`} role="alert">
          {notification.message}
        </p>
      )}
    </div>
  )
}
