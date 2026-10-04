import { apiRequest } from '@/api/api-client'
import type { ApiData } from '@/features/movies/model/movie.types'

export function subscribeToMovie(slug: string, token: string) {
  return apiRequest<ApiData<{ movieId: number; subscribed: boolean }>>(
    `/movies/${encodeURIComponent(slug)}/notify`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
  )
}
