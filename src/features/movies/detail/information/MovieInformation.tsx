import type { MovieDetail } from '../api/movie-detail'
import styles from './MovieInformation.module.scss'

export function MovieInformation({ movie }: { movie: MovieDetail }) {
  const release = new Date(`${movie.releaseDate}T12:00:00Z`).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const fields = [
    ['Genre', movie.genres.map((genre) => genre.name).join(', ') || 'Not available'],
    ['Director', movie.director || 'Not available'],
    ['Main cast', movie.cast || 'Not available'],
    ['Duration', `${movie.runtimeMinutes} minutes`],
    ['Release date', release],
    ['Formats', movie.formats.map((format) => format.name).join(', ') || 'Not available'],
    ['From', `₾${movie.fromPrice}`],
  ]
  return (
    <aside className={styles.details} aria-labelledby="movie-details-heading">
      <h2 id="movie-details-heading">Details</h2>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.rating}>
        <h3>Rating note</h3>
        <p>
          <strong>{movie.ageRating.code}</strong>
          {movie.ageRating.description}
        </p>
      </div>
    </aside>
  )
}
