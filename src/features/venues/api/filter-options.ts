import { apiRequest } from '@/api/api-client'
import type { Venue } from '../model/venue.types'

export type FilterOptions = {
  venues: Venue[]
  ageRatings: { code: string; minAge: number; description: string }[]
}

export async function getFilterOptions(signal?: AbortSignal) {
  const response = await apiRequest<{ data: FilterOptions }>('/filter-options', { signal })
  return response.data
}
