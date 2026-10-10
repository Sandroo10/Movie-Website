import { nextSevenDays, todayInTbilisi } from '../model/session-dates'
import styles from './SessionFilters.module.scss'

export function DateFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const days = nextSevenDays(todayInTbilisi())
  return (
    <div>
      <div className={styles.days} aria-label="Session date">
        {days.map((day) => (
          <button
            type="button"
            key={day.value}
            aria-label={day.value}
            aria-pressed={day.value === value}
            onClick={() => onChange(day.value)}
          >
            <span>{day.day}</span>
            <span>{day.number}</span>
          </button>
        ))}
      </div>
      {!days.some((day) => day.value === value) && (
        <p className={styles.selectedDate}>Selected: {value}</p>
      )}
    </div>
  )
}
