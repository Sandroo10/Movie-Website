import { Link } from 'react-router'
import type { Movie } from '@/features/movies/model/movie.types'
import { SearchResultItem } from './SearchResultItem'
import { SearchSkeleton } from './SearchSkeleton'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
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
}: Readonly<{
  query: string
  term: string
  waiting: boolean
  error: Error | null
  matches: Movie[]
  selected: number
  listId: string
  onSelect: (movie: Movie) => void
  onRetry: () => void
}>) {
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
  function renderStatus() {
    if (!query.trim()) return empty('popcorn', 'What do you want to watch?', 'Search by title')
    if (waiting) return <SearchSkeleton />
    if (error) {
      return (
        <FeedbackState
          className={styles.searchMessage}
          error
          message={error.message}
          onAction={onRetry}
          actionLabel="Try again"
        />
      )
    }
    if (!matches.length) {
      return empty(
        'search-large',
        `No results for “${term}”`,
        'Check the spelling or try another film or live event.',
      )
    }
    return (
      <div className={styles.searchHeading}>
        <strong>FILMS &amp; EVENTS</strong>
        <span>
          {matches.length} {matches.length === 1 ? 'result' : 'results'}
        </span>
      </div>
    )
  }

  return (
    <div className={styles.searchPanel}>
      {renderStatus()}
      {/* Rich combobox results use listbox/options with keyboard navigation via aria-activedescendant. */}
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
