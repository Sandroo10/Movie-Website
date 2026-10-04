import type { Movie } from '@/features/movies/model/movie.types'
import styles from '@/features/search/search-box/MovieSearch.module.scss'
export function SearchResultItem({
  movie,
  term,
  id,
  selected,
  onSelect,
}: {
  movie: Movie
  term: string
  id: string
  selected: boolean
  onSelect: () => void
}) {
  const matchStart = movie.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())
  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      className={selected ? styles.selectedResult : ''}
    >
      {movie.posterUrl && <img src={movie.posterUrl} alt="" />}
      <div>
        <strong>
          {matchStart < 0 ? (
            movie.title
          ) : (
            <>
              {movie.title.slice(0, matchStart)}
              <mark>{movie.title.slice(matchStart, matchStart + term.length)}</mark>
              {movie.title.slice(matchStart + term.length)}
            </>
          )}
        </strong>
        <small>
          {movie.kind === 'film' ? 'Film' : 'Event'} · {movie.ageRating.code} ·{' '}
          {movie.runtimeMinutes} min
        </small>
      </div>
      <span className={movie.isComingSoon ? styles.comingLabel : undefined}>
        {movie.isComingSoon ? 'Coming Soon' : `from ₾${movie.fromPrice}`}
      </span>
    </li>
  )
}
