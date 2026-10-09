import { useId, type SelectHTMLAttributes, type Ref } from 'react'
import type { Venue } from '@/features/venues/model/venue.types'
import styles from './PersonalInformation.module.scss'

export function VenueField({
  venues,
  pending,
  error,
  onRetry,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: Ref<HTMLSelectElement>
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
        <select
          {...props}
          id={id}
          disabled={props.disabled || pending || Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <option value="">{pending ? 'Loading venues…' : 'Select a venue'}</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name} · {venue.city}
            </option>
          ))}
        </select>
        <img src="/assets/kino/chevron-down.svg" alt="" />
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
