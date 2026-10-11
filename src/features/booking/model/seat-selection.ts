import type { FilterOptions } from '@/features/venues/api/filter-options'
import type { Seat, Selection } from './booking.types'
type TicketType = FilterOptions['ticketTypes'][number]

export function ticketPrice(basePrice: number, ratio: number) {
  return Math.round(basePrice * ratio * 100) / 100
}
export function ticketTypeAllowed(type: TicketType | undefined, minimumAge: number) {
  return Boolean(
    type && (type.blockedFromRatingAge == null || minimumAge < type.blockedFromRatingAge),
  )
}
export function seatSelectionDetails(
  selection: Selection[],
  seats: Seat[],
  types: TicketType[],
  contested: string[],
  minimumAge: number,
) {
  return selection.map((item) => {
    const seat = seats.find((seat) => seat.id === item.seatId)
    const type = types.find((type) => type.slug === item.ticketType)
    let problem: string | null = null
    if (!seat)
      problem = 'This seat is no longer on the hall map. Remove it and select another seat.'
    else if (contested.includes(seat.code) || seat.state === 'sold')
      problem = 'This seat has been sold. Remove it and select another seat.'
    else if (seat.state === 'held' && !seat.isMine)
      problem = 'This seat is held by another customer. Remove it and select another seat.'
    else if (seat.state === 'unavailable')
      problem = 'This seat is unavailable. Remove it and select another seat.'
    else if (!type) problem = 'This ticket type is no longer available. Choose another ticket type.'
    else if (!ticketTypeAllowed(type, minimumAge))
      problem = 'This ticket type is not allowed for this age rating.'
    return { ...item, seat, type, problem }
  })
}
