import { apiRequest } from '@/api/api-client'
import type { Venue } from '../model/venue.types'

export type FilterOptions = {
  venues: Venue[]
  formats: { id: number; slug: string; name: string; priceUplift: number }[]
  languages: { id: number; slug: string; name: string; code: string }[]
  timeBands: { id: string; label: string }[]
  sorts: { id: string; label: string }[]
  ageRatings: { code: string; minAge: number; description: string }[]
  ticketTypes: {
    id: number
    slug: string
    name: string
    priceRatio: number
    note: string | null
    blockedFromRatingAge: number | null
  }[]
  maxSeatsPerOrder: number
  holdMinutes: number
}

export async function getFilterOptions(signal?: AbortSignal) {
  const response = await apiRequest<{ data: FilterOptions }>('/filter-options', { signal })
  return response.data
}
