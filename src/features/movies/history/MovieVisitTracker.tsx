import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { apiRequest } from '@/api/api-client'
import { useAuth } from '@/features/auth/session/auth-context'
import type { ApiData, Movie } from '../model/movie.types'
import { useRecentMovies } from './recent-movies'

// Record a real detail-page visit, including direct links, rather than a poster click.
export function MovieVisitTracker() {
  const { movieId } = useParams()
  const { user } = useAuth()
  const { remember } = useRecentMovies(user?.id)
  const movie = useQuery({
    queryKey: ['catalogue', 'detail', movieId],
    enabled: Boolean(user && movieId),
    queryFn: async ({ signal }) => {
      const response = await apiRequest<ApiData<Movie>>(`/movies/${encodeURIComponent(movieId!)}`, {
        signal,
      })
      return response.data
    },
    staleTime: 60_000,
  })
  useEffect(() => {
    if (movie.data) remember(movie.data)
  }, [movie.data, remember])
  return null
}
