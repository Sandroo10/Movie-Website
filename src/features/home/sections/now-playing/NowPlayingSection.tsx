import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { nowPlayingMoviesOptions } from '@/features/home/api/now-playing-movies'
import { MovieCard } from '@/features/movies/cards/movie-card/MovieCard'
import { MovieRail } from '@/features/movies/components/movie-rail/MovieRail'
import { CatalogueState } from '@/features/home/states/catalogue/CatalogueState'
import styles from './NowPlayingSection.module.scss'

export function NowPlayingSection() {
  const movies = useQuery(nowPlayingMoviesOptions)

  return (
    <section className={styles.section} aria-labelledby="now-playing-heading">
      <div className={styles.heading}>
        <h2 id="now-playing-heading">NOW PLAYING</h2>
        <Link to="/sessions">See all</Link>
      </div>
      {movies.isPending ? (
        <CatalogueState message="Loading now playing films…" />
      ) : movies.isError ? (
        <CatalogueState
          message="Unable to load now playing films."
          onRetry={() => void movies.refetch()}
        />
      ) : movies.data.length === 0 ? (
        <CatalogueState message="No films are playing right now." />
      ) : (
        <MovieRail label="Now playing films">
          {movies.data.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieRail>
      )}
    </section>
  )
}
