import { useRecentMovies } from '@/features/movies/history/recent-movies'
import { RecentMovieCard } from '@/features/movies/cards/recent-movie-card/RecentMovieCard'
import { MovieRail } from '@/features/movies/components/movie-rail/MovieRail'
import styles from './RecentlyViewedSection.module.scss'

export function RecentlyViewedSection({ userId }: { userId: number }) {
  const { movies } = useRecentMovies(userId)
  return (
    <section className={styles.section} aria-labelledby="recently-viewed-title">
      <div className={styles.content}>
        <h2 id="recently-viewed-title">Recently viewed</h2>
        {movies.length ? (
          <MovieRail variant="recent" label="Recently viewed films">
            {movies.map((movie) => (
              <RecentMovieCard key={movie.id} movie={movie} />
            ))}
          </MovieRail>
        ) : (
          <p className={styles.empty}>Films you view will appear here.</p>
        )}
      </div>
    </section>
  )
}
