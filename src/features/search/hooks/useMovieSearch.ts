import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { movieSearchOptions } from '../api/movie-search'
export function useMovieSearch(query: string, open: boolean) {
  const term = query.trim()
  const debounced = useDebouncedValue(term, 300)
  const result = useQuery({ ...movieSearchOptions(debounced), enabled: Boolean(debounced) && open })
  return {
    result,
    term: debounced,
    waiting: term !== debounced || (result.isPending && !result.isError),
    matches: term === debounced ? (result.data ?? []) : [],
  }
}
