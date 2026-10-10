import { useQuery } from '@tanstack/react-query'
import { getSessions } from '../api/sessions.api'
import type { SessionFilters } from '../model/session.types'

export function useSessions(filters: SessionFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: ({ signal }) => getSessions(filters, signal),
    enabled,
    staleTime: 30_000,
    retry: 1,
  })
}
