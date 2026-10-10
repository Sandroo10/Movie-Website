import type { FilterOptions } from '@/features/venues/api/filter-options'
import styles from './SessionsToolbar.module.scss'
import { Skeleton } from '@/components/ui/skeleton/Skeleton'
import { Select } from '@/components/ui/select/Select'

export function SessionsToolbar({
  options,
  sort,
  total,
  onSort,
}: {
  options: FilterOptions
  sort: string
  total?: number
  onSort: (value: string) => void
}) {
  return (
    <div className={styles.toolbar}>
      <p aria-live="polite">
        {total === undefined ? (
          <span role="status" aria-label="Loading session count">
            <Skeleton width={150} height={16} />
          </span>
        ) : total ? (
          `Showing ${total} sessions`
        ) : (
          'No sessions found'
        )}
      </p>
      <div className={styles.sort}>
        Sort:
        <Select
          label="Sort sessions"
          value={sort}
          onChange={onSort}
          options={options.sorts.map((option) => ({ value: option.id, label: option.label }))}
        />
      </div>
    </div>
  )
}
