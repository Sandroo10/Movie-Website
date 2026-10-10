import { useId, type Ref } from 'react'
import { Select } from '@/components/ui/select/Select'
import type { Venue } from '@/features/venues/model/venue.types'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './PersonalInformation.module.scss'

export function VenueField({
  venues,
  pending,
  error,
  onRetry,
  ...props
}: {
  ref?: Ref<HTMLButtonElement>
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  disabled: boolean
  venues: Venue[]
  pending: boolean
  error: Error | null
  onRetry: () => void
}) {
  const id = useId()
  return (
    <div className={styles.venueField}>
      <label htmlFor={id}>Preferred Venue (Optional)</label>
      <div className={styles.selectWrap}>
        {pending ? (
          <SkeletonGroup label="Loading venues">
            <Skeleton height={40} radius={12} />
          </SkeletonGroup>
        ) : (
          <Select
            {...props}
            id={id}
            label="Preferred Venue (Optional)"
            disabled={props.disabled || Boolean(error)}
            describedBy={error ? `${id}-error` : undefined}
            options={[
              { value: '', label: 'Select a venue' },
              ...venues.map((venue) => ({
                value: String(venue.id),
                label: `${venue.name} · ${venue.city}`,
              })),
            ]}
          />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert">
          Unable to load venues.{' '}
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        </p>
      )}
    </div>
  )
}
