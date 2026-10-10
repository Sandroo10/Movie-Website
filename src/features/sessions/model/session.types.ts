import type { Movie } from '@/features/movies/model/movie.types'
import type { Venue } from '@/features/venues/model/venue.types'

export type Session = {
  id: number
  startsAt: string
  date: string
  time: string
  price: number
  seatsLeft: number
  isSoldOut: boolean
  hall: { id: number; name: string }
  venue: Venue
  format: { id: number; slug: string; name: string }
  language: { id: number; slug: string; name: string; code: string }
  movie: Movie
}
export type SessionGroup = { movie: Movie; sessions: Session[] }
export type SessionsResponse = {
  data: SessionGroup[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    totalSessions: number
    totalMovies: number
    date: string
  }
}
export type SessionFilters = {
  venues: string[]
  formats: string[]
  languages: string[]
  bands: string[]
  date: string
  search: string
  sort: string
  page: number
}
export type MultiFilter = 'venues' | 'formats' | 'languages' | 'bands'
