import { apiRequest } from '@/api/api-client'
import type { SessionFilters, SessionsResponse } from '../model/session.types'
import { writeSessionFilters } from '../model/session-filters'

export function getSessions(filters: SessionFilters, signal?: AbortSignal) {
  return apiRequest<SessionsResponse>(`/sessions?${writeSessionFilters(filters)}`, { signal })
}
