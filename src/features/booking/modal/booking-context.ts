import { createContext, useContext } from 'react'
import type { Session } from '@/features/sessions/model/session.types'
import type { FilterOptions } from '@/features/venues/api/filter-options'

export const BookingContext = createContext<{
  showBooking: (session: Session, options: FilterOptions, onDismiss: () => void) => void
} | null>(null)

export function useBookingModal() {
  const value = useContext(BookingContext)
  if (!value) throw new Error('Booking requires BookingProvider.')
  return value
}
