import { useQuery } from '@tanstack/react-query'
import { getFilterOptions } from '../api/filter-options'

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: ({ signal }) => getFilterOptions(signal),
    staleTime: Infinity,
    retry: 1,
  })
}
