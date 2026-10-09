import type { Movie } from '@/features/movies/model/movie.types'
import type { Venue } from '@/features/venues/model/venue.types'

export type TicketOrder = {
  id: number
  reference: string
  status: 'paid' | 'refunded'
  totalPrice: number
  isUpcoming: boolean
  isRefundable: boolean
  refundedAt: string | null
  session: {
    startsAt: string
    date: string
    time: string
    hall: { id: number; name: string }
    venue: Venue
    format: { id: number; slug: string; name: string }
    language: { id: number; slug: string; name: string; code: string }
    movie: Movie
  }
  tickets: {
    id: number
    seatCode: string
    ticketType: { slug: string; name: string }
    price: number
  }[]
}
