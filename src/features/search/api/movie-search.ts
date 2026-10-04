import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/api-client'
import type { ApiData, Movie } from '@/features/movies/model/movie.types'

export function movieSearchOptions(term: string) {
  return queryOptions({
    queryKey: ['catalogue', 'search', term],
    queryFn: async ({ signal }) => {
      const response = await apiRequest<ApiData<Movie[]>>(`/search?q=${encodeURIComponent(term)}`, {
        signal,
      })
      return response.data
    },
    staleTime: 60_000,
  })
}
