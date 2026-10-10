import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@/features/auth/session/auth-context'
import { nextSevenDays, todayInTbilisi } from '@/features/sessions/model/session-dates'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import { movieShowtimesOptions, type MovieDetail } from '../api/movie-detail'
import styles from './MovieShowtimes.module.scss'
import { VenueShowtimes } from './VenueShowtimes'
import { useMovieNotification } from '@/features/movies/hooks/useMovieNotification'

export function MovieShowtimes({ movie }: { movie: MovieDetail }) {
  const days = nextSevenDays(todayInTbilisi())
  const [date, setDate] = useState(
    () => days.find((day) => movie.availableDates.includes(day.value))?.value ?? days[0].value,
  )
  const { user, token } = useAuth()
  const notification = useMovieNotification(movie.slug)
  const query = useQuery({
    ...movieShowtimesOptions(movie.slug, date),
    enabled: !movie.isComingSoon,
  })
  const blocked = user?.age != null && user.age < movie.ageRating.minAge
  if (movie.isComingSoon)
    return (
      <div className={styles.section}>
        <FeedbackState
          title="Coming soon"
          message="Sessions will be announced when this title opens."
        />
        <button
          className={styles.notify}
          type="button"
          disabled={
            notification.pending || Boolean(token && (movie.isNotified || notification.subscribed))
          }
          onClick={notification.notify}
        >
          {notification.pending
            ? 'Please wait…'
            : token && (movie.isNotified || notification.subscribed)
              ? 'Subscribed'
              : 'Notify Me'}
        </button>
        {notification.message && <p role="alert">{notification.message}</p>}
      </div>
    )
  return (
    <section className={styles.section} aria-labelledby="movie-sessions-heading">
      <h2 id="movie-sessions-heading">Sessions</h2>
      <p className={styles.summary}>
        {movie.availableDates.filter((value) => days.some((day) => day.value === value)).length}{' '}
        days with sessions over the next seven days
      </p>
      <div className={styles.days} aria-label="Session dates">
        {days.map((day) => (
          <button
            key={day.value}
            type="button"
            disabled={!movie.availableDates.includes(day.value)}
            aria-pressed={date === day.value}
            onClick={() => setDate(day.value)}
          >
            <span>{day.day}</span>
            <strong>{day.number}</strong>
          </button>
        ))}
      </div>
      {blocked && (
        <p role="alert">
          This film is rated {movie.ageRating.code}. You cannot buy tickets for it with this
          account.
        </p>
      )}
      {query.isPending ? (
        <SkeletonGroup label="Loading movie sessions" className={styles.loading}>
          {[0, 1].map((item) => (
            <Skeleton key={item} height={140} radius={18} />
          ))}
        </SkeletonGroup>
      ) : query.isError ? (
        <FeedbackState
          error
          message="Unable to load showtimes."
          onAction={() => void query.refetch()}
        />
      ) : !query.data?.length ? (
        <FeedbackState message="No sessions on this date. Choose another available day." />
      ) : (
        query.data.map((group) => (
          <VenueShowtimes key={group.venue.id} group={group} movie={movie} />
        ))
      )}
      {query.isFetching && !query.isPending && <p role="status">Refreshing showtimes…</p>}
    </section>
  )
}
