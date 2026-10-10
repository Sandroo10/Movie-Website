import type { MovieDetail } from '../api/movie-detail'
import styles from './MovieBanner.module.scss'

export function MovieBanner({ movie }: { movie: MovieDetail }) {
  return (
    <header className={styles.banner}>
      {movie.backdropUrl && <img className={styles.backdrop} src={movie.backdropUrl} alt="" />}
      <div className={styles.content}>
        {movie.posterUrl ? (
          <img className={styles.poster} src={movie.posterUrl} alt={`${movie.title} poster`} />
        ) : (
          <div className={styles.poster}>No poster available</div>
        )}
        <div className={styles.copy}>
          <span className={styles.accent}>
            {movie.isComingSoon ? 'COMING SOON' : 'NOW PLAYING'}
          </span>
          <h1>{movie.title}</h1>
          <p>{movie.synopsis || 'A synopsis is not available for this title.'}</p>
          <div className={styles.badges}>
            <span className={styles.accent} title={movie.ageRating.description}>
              {movie.ageRating.code}
            </span>
            <span>
              <img src="/assets/kino/timer.svg" alt="" />
              {movie.runtimeMinutes} Min
            </span>
            {movie.formats.map((format) => (
              <span key={format.id}>{format.name}</span>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
