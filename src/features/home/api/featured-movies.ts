import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/api-client'
import type { ApiData, Movie } from '@/features/movies/model/movie.types'

export const featuredMoviesOptions = queryOptions({
  queryKey: ['catalogue', 'featured'],
  queryFn: async ({ signal }) => {
    const response = await apiRequest<ApiData<Movie[]>>('/movies/featured', { signal })
    return response.data
  },
  staleTime: 60_000,
})
