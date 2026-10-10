import type { TicketOrder } from '@/features/profile/model/ticket.types'
export type Seat = {
  id: number
  code: string
  label: string
  state: 'available' | 'sold' | 'held' | 'unavailable'
  aisleAfter: boolean
  isMine: boolean
}
export type SeatMap = {
  sessionId: number
  sections: { name: string; rows: { label: string; seats: Seat[] }[] }[]
}
export type Selection = { seatId: number; ticketType: string }
export type SeatHold = {
  holdId: string
  sessionId: number
  expiresAt: string
  secondsRemaining: number
  isLive: boolean
  subtotal: number
  seats: {
    seatId: number
    code: string
    ticketType: { slug: string; name: string }
    price: number
  }[]
}
export type BookingOrder = TicketOrder
