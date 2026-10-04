import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/api-client'
import type { ApiData, Movie } from '@/features/movies/model/movie.types'

export const comingSoonMoviesOptions = queryOptions({
  queryKey: ['catalogue', 'coming-soon'],
  queryFn: async ({ signal }) => {
    const response = await apiRequest<ApiData<Movie[]>>('/movies/coming-soon', { signal })
    return response.data
  },
  staleTime: 60_000,
})
