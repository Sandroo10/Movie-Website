import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/api-client'
import { isApiError } from '@/api/api-error'
import type { ApiData, Movie } from '@/features/movies/model/movie.types'

export const comingSoonMoviesOptions = (token: string | null, revision: number) =>
  queryOptions({
    queryKey: ['catalogue', 'coming-soon', revision],
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const response = await apiRequest<ApiData<Movie[]>>('/movies/coming-soon', {
        signal,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      return response.data
    },
    staleTime: 60_000,
    retry: (count, error) => !(isApiError(error) && error.status === 401) && count < 1,
  })
