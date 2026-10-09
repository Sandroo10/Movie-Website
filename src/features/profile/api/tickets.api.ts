import { apiRequest } from '@/api/api-client'
import type { TicketOrder } from '../model/ticket.types'

export async function getTickets(token: string, signal?: AbortSignal) {
  const response = await apiRequest<{ data: TicketOrder[] }>('/tickets', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return response.data
}

export async function refundOrder(reference: string, token: string) {
  const response = await apiRequest<{ data: TicketOrder }>(
    `/orders/${encodeURIComponent(reference)}/refund`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return response.data
}
