import { useCallback, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '@/components/ui/icon/Icon'
import { useDismissOutside } from '@/hooks/useDismissOutside'
import type { Movie } from '@/features/movies/model/movie.types'
import { useMovieSearch } from '@/features/search/hooks/useMovieSearch'
import { SearchResults } from '@/features/search/results/SearchResults'
import styles from './MovieSearch.module.scss'
export function MovieSearch() {
  const navigate = useNavigate()
  const container = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(-1)
  const close = useCallback(() => {
    setOpen(false)
    setSelected(-1)
  }, [])
  useDismissOutside(container, close, open)
  const { result, term, waiting, matches } = useMovieSearch(query, open)
  const select = (movie: Movie) => {
    close()
    navigate(`/movies/${movie.slug}`)
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key === 'ArrowDown' && matches.length) {
      event.preventDefault()
      setOpen(true)
      setSelected((value) => (value + 1) % matches.length)
    }
    if (event.key === 'ArrowUp' && matches.length) {
      event.preventDefault()
      setOpen(true)
      setSelected((value) =>
        value < 0 ? matches.length - 1 : (value - 1 + matches.length) % matches.length,
      )
    }
    if (event.key === 'Enter' && selected >= 0 && matches[selected]) {
      event.preventDefault()
      select(matches[selected])
    }
  }
  return (
    <div
      ref={container}
      className={[styles.search, open ? styles.searchOpen : ''].join(' ')}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close()
      }}
    >
      <div className={styles.searchBar}>
        <Icon name="search" />
        <input
          ref={input}
          type="search"
          aria-label="Search films and live events"
          placeholder="Search films and live events"
          value={query}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && selected >= 0 && matches[selected] ? `${listId}-${selected}` : undefined
          }
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setSelected(-1)
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            className={styles.clearSearch}
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              setSelected(-1)
              input.current?.focus()
            }}
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      {open && (
        <SearchResults
          query={query}
          term={term}
          waiting={waiting}
          error={result.error}
          matches={matches}
          selected={selected}
          listId={listId}
          onSelect={select}
          onRetry={() => void result.refetch()}
        />
      )}
    </div>
  )
}
