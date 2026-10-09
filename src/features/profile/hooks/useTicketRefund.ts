import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import { isApiError } from '@/api/api-error'
import { useAuth } from '@/features/auth/session/auth-context'
import { refundOrder } from '../api/tickets.api'
import type { TicketOrder } from '../model/ticket.types'

export function useTicketRefund(reference: string) {
  const { token, user, expireSession } = useAuth()
  const client = useQueryClient()
  const mutationKey = ['ticket-refund', reference]
  const pending = useIsMutating({ mutationKey }) > 0
  const mutation = useMutation({
    mutationKey,
    retry: false,
    mutationFn: (accessToken: string) => refundOrder(reference, accessToken),
    onSuccess: (order) => {
      client.setQueryData<TicketOrder[]>(['profile', 'tickets', user?.id], (orders) =>
        orders?.map((current) => (current.id === order.id ? order : current)),
      )
      void client.invalidateQueries({ queryKey: ['profile', 'tickets'] })
      void client.invalidateQueries({ queryKey: ['catalogue'] })
    },
    onError: () => {
      void client.invalidateQueries({ queryKey: ['profile', 'tickets'] })
    },
  })
  async function refund(accessToken = token) {
    if (!accessToken || client.isMutating({ mutationKey })) return
    try {
      await mutation.mutateAsync(accessToken)
    } catch (error) {
      if (isApiError(error) && error.status === 401) expireSession((newToken) => refund(newToken))
    }
  }
  return { refund, pending, error: mutation.error, clearError: mutation.reset }
}
