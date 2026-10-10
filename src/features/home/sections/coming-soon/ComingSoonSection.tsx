import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { isApiError } from '@/api/api-error'
import { Link } from 'react-router'
import { comingSoonMoviesOptions } from '@/features/home/api/coming-soon-movies'
import { CatalogueState } from '@/features/home/states/catalogue/CatalogueState'
import { CatalogueSkeleton } from '@/features/home/states/skeleton/HomeSkeleton'
import { UpcomingMovieCard } from '@/features/movies/cards/upcoming-movie-card/UpcomingMovieCard'
import { MovieRail } from '@/features/movies/components/movie-rail/MovieRail'
import { useAuth } from '@/features/auth/session/auth-context'
import styles from './ComingSoonSection.module.scss'
import { RefreshIndicator } from '@/components/ui/refresh-indicator/RefreshIndicator'

export function ComingSoonSection() {
  const { token, revision, expireSession } = useAuth()
  const movies = useQuery(comingSoonMoviesOptions(token, revision))
  useEffect(() => {
    if (token && isApiError(movies.error) && movies.error.status === 401) expireSession()
  }, [token, movies.error, expireSession])

  return (
    <section className={styles.section} aria-labelledby="coming-soon-heading">
      <div className={styles.heading}>
        <h2 id="coming-soon-heading">COMING SOON...</h2>
        <Link to="/sessions">See all</Link>
      </div>
      {movies.isFetching && !movies.isPending && (
        <RefreshIndicator label="Refreshing upcoming films…" />
      )}
      {movies.isPending ? (
        <CatalogueSkeleton upcoming />
      ) : movies.isError ? (
        <CatalogueState
          compact
          message="Unable to load upcoming films."
          onRetry={() => void movies.refetch()}
        />
      ) : movies.data.length === 0 ? (
        <CatalogueState compact message="No upcoming films available right now." />
      ) : (
        <MovieRail label="Coming soon films" variant="upcoming">
          {movies.data.map((movie) => (
            <UpcomingMovieCard key={movie.id} movie={movie} />
          ))}
        </MovieRail>
      )}
    </section>
  )
}
