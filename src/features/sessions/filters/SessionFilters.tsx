import type { FilterOptions } from '@/features/venues/api/filter-options'
import { activeFilterCount, availableFormats } from '../model/session-filters'
import type { MultiFilter, SessionFilters as Filters } from '../model/session.types'
import { FilterCheckbox, FilterGroup } from './FilterGroup'
import { DateFilter } from './DateFilter'
import styles from './SessionFilters.module.scss'

export function SessionFilters({
  options,
  filters,
  onChange,
  onClear,
}: {
  options: FilterOptions
  filters: Filters
  onChange: (patch: Partial<Filters>) => void
  onClear: () => void
}) {
  function toggle(key: MultiFilter, value: string) {
    onChange({
      [key]: filters[key].includes(value)
        ? filters[key].filter((item) => item !== value)
        : [...filters[key], value],
    })
  }
  const count = activeFilterCount(filters)
  return (
    <aside className={styles.panel} aria-label="Filter sessions">
      <h2>Filters</h2>
      <div className={styles.groups}>
        <FilterGroup title="Venue">
          {options.venues.map((venue) => (
            <FilterCheckbox
              key={venue.id}
              label={venue.name}
              detail={venue.city}
              checked={filters.venues.includes(venue.slug)}
              onChange={() => toggle('venues', venue.slug)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Date">
          <DateFilter value={filters.date} onChange={(date) => onChange({ date })} />
        </FilterGroup>
        <FilterGroup title="Format">
          {availableFormats(options, filters.venues).map((format) => (
            <FilterCheckbox
              key={format.id}
              label={format.name}
              checked={filters.formats.includes(format.slug)}
              onChange={() => toggle('formats', format.slug)}
            />
          ))}
          {!availableFormats(options, filters.venues).length && (
            <p>No formats available at these venues.</p>
          )}
        </FilterGroup>
        <FilterGroup title="Language">
          {options.languages.map((language) => (
            <FilterCheckbox
              key={language.id}
              label={language.name}
              checked={filters.languages.includes(language.slug)}
              onChange={() => toggle('languages', language.slug)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Time of day">
          {options.timeBands.map((band) => {
            const parts = /^(.*?)\s*\((.*?)\)$/.exec(band.label)
            return (
              <FilterCheckbox
                key={band.id}
                label={parts?.[1] ?? band.label}
                detail={parts?.[2]}
                checked={filters.bands.includes(band.id)}
                onChange={() => toggle('bands', band.id)}
              />
            )
          })}
        </FilterGroup>
      </div>
      <footer className={styles.footer}>
        {(count > 0 || filters.search || filters.sort !== 'time_asc') && (
          <button type="button" onClick={onClear}>
            Clear All Filters
          </button>
        )}
        <p>
          {count} {count === 1 ? 'filter' : 'filters'} active
        </p>
      </footer>
    </aside>
  )
}
