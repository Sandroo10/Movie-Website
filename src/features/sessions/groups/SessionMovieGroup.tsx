import { Link } from 'react-router'
import { MovieRail } from '@/features/movies/components/movie-rail/MovieRail'
import type { SessionGroup, Session } from '../model/session.types'
import { SessionCard } from '../cards/SessionCard'
import styles from './SessionMovieGroup.module.scss'

export function SessionMovieGroup({
  group,
  age,
  onSelect,
}: {
  group: SessionGroup
  age?: number | null
  onSelect: (session: Session) => void
}) {
  const { movie, sessions } = group
  const blocked =
    age != null && age < movie.ageRating.minAge
      ? `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`
      : undefined
  return (
    <article className={styles.group}>
      <div className={styles.header}>
        <Link to={`/movies/${movie.slug}`} aria-label={`View ${movie.title}`}>
          {movie.posterUrl ? (
            <img className={styles.poster} src={movie.posterUrl} alt="" />
          ) : (
            <span className={styles.poster} />
          )}
        </Link>
        <div>
          <div className={styles.title}>
            <h2>
              <Link to={`/movies/${movie.slug}`}>{movie.title}</Link>
            </h2>
            <span>{movie.ageRating.code}</span>
          </div>
          <p>{movie.runtimeMinutes} min</p>
        </div>
      </div>
      {blocked && <p className={styles.blocked}>{blocked}</p>}
      <MovieRail label={`${movie.title} showtimes`} variant="sessions">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} blocked={blocked} onSelect={onSelect} />
        ))}
      </MovieRail>
    </article>
  )
}
