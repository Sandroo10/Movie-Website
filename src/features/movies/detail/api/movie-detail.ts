import { queryOptions } from '@tanstack/react-query'
import { apiRequest } from '@/api/api-client'
import type { ApiData, Movie } from '../../model/movie.types'
import type { Session } from '@/features/sessions/model/session.types'
import type { Venue } from '@/features/venues/model/venue.types'

export type MovieDetail = Movie & {
  director: string | null
  cast: string | null
  availableDates: string[]
}
export type MovieShowtime = Omit<Session, 'movie'>
export type VenueShowtimes = { venue: Venue; sessions: MovieShowtime[] }
export const movieDetailOptions = (slug: string) =>
  queryOptions({
    queryKey: ['catalogue', 'detail', slug],
    queryFn: async ({ signal }) =>
      (await apiRequest<ApiData<MovieDetail>>(`/movies/${encodeURIComponent(slug)}`, { signal }))
        .data,
    staleTime: 60_000,
    retry: 1,
  })
export const movieShowtimesOptions = (slug: string, date: string) =>
  queryOptions({
    queryKey: ['catalogue', 'movie-sessions', slug, date],
    queryFn: async ({ signal }) =>
      (
        await apiRequest<ApiData<VenueShowtimes[]>>(
          `/movies/${encodeURIComponent(slug)}/sessions?date=${encodeURIComponent(date)}`,
          { signal },
        )
      ).data,
    staleTime: 30_000,
    retry: 1,
  })
