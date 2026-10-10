import { apiRequest } from '@/api/api-client'
import type { ApiData } from '@/features/movies/model/movie.types'
import type { Session } from '@/features/sessions/model/session.types'
import type { BookingOrder, SeatHold, SeatMap, Selection } from '../model/booking.types'
import type { CheckoutValues } from '../model/checkout.schema'
export async function getBookingSession(id: number, signal: AbortSignal) {
  return (await apiRequest<ApiData<Session>>(`/sessions/${id}`, { signal })).data
}
export async function getSeatMap(id: number, token: string, signal: AbortSignal) {
  return (
    await apiRequest<ApiData<SeatMap>>(`/sessions/${id}/seats`, {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data
}
export async function holdSeats(id: number, seats: Selection[], token: string) {
  return (
    await apiRequest<ApiData<SeatHold>>(`/sessions/${id}/holds`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ seats }),
    })
  ).data
}
export async function placeOrder(holdId: string, values: CheckoutValues, token: string) {
  return (
    await apiRequest<ApiData<BookingOrder>>('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ holdId, ...values }),
    })
  ).data
}
