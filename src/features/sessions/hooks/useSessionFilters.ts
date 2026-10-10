import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import type { FilterOptions } from '@/features/venues/api/filter-options'
import {
  normalizeSessionFilters,
  readSessionFilters,
  writeSessionFilters,
  clearSessionFilters,
  updateSessionFilters,
} from '../model/session-filters'
import type { SessionFilters } from '../model/session.types'

export function useSessionFilters(options?: FilterOptions) {
  const [params, setParams] = useSearchParams()
  const raw = readSessionFilters(params)
  const filters = options ? normalizeSessionFilters(raw, options) : raw
  const serialized = writeSessionFilters(filters).toString()
  const current = params.toString()
  useEffect(() => {
    if (options && serialized !== current) setParams(serialized, { replace: true })
  }, [options, serialized, current, setParams])
  function change(patch: Partial<SessionFilters>) {
    setParams(writeSessionFilters(updateSessionFilters(filters, patch, options)))
  }
  return { filters, change, clear: () => change(clearSessionFilters(filters)) }
}
