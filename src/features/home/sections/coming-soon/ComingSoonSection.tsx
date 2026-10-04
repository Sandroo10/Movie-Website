import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { comingSoonMoviesOptions } from '@/features/home/api/coming-soon-movies'
import { CatalogueState } from '@/features/home/states/catalogue/CatalogueState'
import { UpcomingMovieCard } from '@/features/movies/cards/upcoming-movie-card/UpcomingMovieCard'
import { MovieRail } from '@/features/movies/components/movie-rail/MovieRail'
import styles from './ComingSoonSection.module.scss'

export function ComingSoonSection() {
  const movies = useQuery(comingSoonMoviesOptions)

  return (
    <section className={styles.section} aria-labelledby="coming-soon-heading">
      <div className={styles.heading}>
        <h2 id="coming-soon-heading">COMING SOON...</h2>
        <Link to="/sessions">See all</Link>
      </div>
      {movies.isPending ? (
        <CatalogueState compact message="Loading upcoming films…" />
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
