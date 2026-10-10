import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { movieDetailOptions } from '@/features/movies/detail/api/movie-detail'
import { MovieBanner } from '@/features/movies/detail/banner/MovieBanner'
import { MovieInformation } from '@/features/movies/detail/information/MovieInformation'
import { MovieShowtimes } from '@/features/movies/detail/showtimes/MovieShowtimes'
import { useAuth } from '@/features/auth/session/auth-context'
import { useRecentMovies } from '@/features/movies/history/recent-movies'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './MoviePage.module.scss'

export function MoviePage() {
  const { movieId = '' } = useParams()
  const query = useQuery(movieDetailOptions(movieId))
  const { user } = useAuth()
  const { remember } = useRecentMovies(user?.id)
  useEffect(() => {
    if (user && query.data) remember(query.data)
  }, [user, query.data, remember])
  if (query.isPending)
    return (
      <main className={styles.page}>
        <SkeletonGroup label="Loading movie details">
          <Skeleton height={630} />
          <div className={styles.loading}>
            <Skeleton width={320} height={416} radius={14} />
            <Skeleton width="60%" height={140} />
          </div>
        </SkeletonGroup>
      </main>
    )
  if (query.isError)
    return (
      <main className={styles.error}>
        <FeedbackState
          error
          title="Unable to load this movie"
          message={query.error.message}
          onAction={() => void query.refetch()}
        >
          <Link to="/sessions">Browse sessions</Link>
        </FeedbackState>
      </main>
    )
  const movie = query.data
  return (
    <main className={styles.page}>
      <MovieBanner movie={movie} />
      <div className={styles.body}>
        <MovieShowtimes key={movie.id} movie={movie} />
        <MovieInformation movie={movie} />
      </div>
    </main>
  )
}
