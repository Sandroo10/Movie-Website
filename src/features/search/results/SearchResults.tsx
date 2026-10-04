import { Link } from 'react-router'
import type { Movie } from '@/features/movies/model/movie.types'
import { SearchResultItem } from './SearchResultItem'
import styles from '@/features/search/search-box/MovieSearch.module.scss'
export function SearchResults({
  query,
  term,
  waiting,
  error,
  matches,
  selected,
  listId,
  onSelect,
  onRetry,
}: {
  query: string
  term: string
  waiting: boolean
  error: Error | null
  matches: Movie[]
  selected: number
  listId: string
  onSelect: (movie: Movie) => void
  onRetry: () => void
}) {
  const empty = (icon: string, title: string, description: string) => (
    <div className={styles.searchEmpty}>
      <span className={styles.emptyIcon}>
        <img src={`/assets/kino/${icon}.svg`} alt="" />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
      <Link to="/sessions">Browse all sessions</Link>
    </div>
  )
  return (
    <div className={styles.searchPanel}>
      {!query.trim() ? (
        empty('popcorn', 'What do you want to watch?', 'Search by title')
      ) : waiting ? (
        <p className={styles.searchMessage} role="status">
          Searching…
        </p>
      ) : error ? (
        <div className={styles.searchMessage} role="alert">
          <p>{error.message}</p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : !matches.length ? (
        empty(
          'search-large',
          `No results for “${term}”`,
          'Check the spelling or try another film or live event.',
        )
      ) : (
        <div className={styles.searchHeading}>
          <strong>FILMS &amp; EVENTS</strong>
          <span>
            {matches.length} {matches.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      )}
      <ul
        id={listId}
        role="listbox"
        aria-label="Matching films and events"
        className={styles.searchResults}
      >
        {query.trim() &&
          !waiting &&
          !error &&
          matches.map((movie, index) => (
            <SearchResultItem
              key={movie.id}
              movie={movie}
              term={term}
              id={`${listId}-${index}`}
              selected={selected === index}
              onSelect={() => onSelect(movie)}
            />
          ))}
      </ul>
    </div>
  )
}
