import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isApiError } from '@/api/api-error'
import { useAuth } from '@/features/auth/session/auth-context'
import { getTickets } from '../api/tickets.api'

export function useTickets() {
  const { user, token, expireSession } = useAuth()
  const handled = useRef<Error | null>(null)
  const query = useQuery({
    queryKey: ['profile', 'tickets', user?.id],
    enabled: Boolean(user && token),
    queryFn: ({ signal }) => getTickets(token!, signal),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: (count, error) => !(isApiError(error) && error.status === 401) && count < 1,
  })
  useEffect(() => {
    if (
      token &&
      query.error !== handled.current &&
      isApiError(query.error) &&
      query.error.status === 401
    ) {
      handled.current = query.error
      expireSession()
    }
  }, [query.error, token, expireSession])
  return query
}
