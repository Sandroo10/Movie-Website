import type { FilterOptions } from '@/features/venues/api/filter-options'
import type { SessionFilters } from './session.types'
import { isCalendarDate, todayInTbilisi } from './session-dates'

const listKeys = ['venues', 'formats', 'languages', 'bands'] as const
export function readSessionFilters(
  params: URLSearchParams,
  today = todayInTbilisi(),
): SessionFilters {
  const list = (key: (typeof listKeys)[number], alias: string) => [
    ...new Set(
      [...params.getAll(`${key}[]`), ...params.getAll(key), ...params.getAll(alias)]
        .flatMap((value) => value.split(','))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ]
  const date = params.get('date') ?? ''
  const page = params.get('page') ?? '1'
  return {
    venues: list('venues', 'venue'),
    formats: list('formats', 'format'),
    languages: list('languages', 'language'),
    bands: list('bands', 'band'),
    date: isCalendarDate(date) ? date : today,
    search: (params.get('search') ?? '').trim().slice(0, 100),
    sort: params.get('sort') || 'time_asc',
    page:
      /^\d+$/.test(page) && Number.isSafeInteger(Number(page)) && Number(page) > 0
        ? Number(page)
        : 1,
  }
}
export function writeSessionFilters(filters: SessionFilters) {
  const params = new URLSearchParams({
    date: filters.date,
    sort: filters.sort,
    page: String(filters.page),
  })
  for (const key of listKeys) for (const value of filters[key]) params.append(`${key}[]`, value)
  if (filters.search) params.set('search', filters.search)
  return params
}
export function availableFormats(options: FilterOptions, venues: string[]) {
  if (!venues.length) return options.formats
  const slugs = new Set(
    options.venues
      .filter((venue) => venues.includes(venue.slug))
      .flatMap((venue) => venue.formats.map((format) => format.slug)),
  )
  return options.formats.filter((format) => slugs.has(format.slug))
}
export function normalizeSessionFilters(
  filters: SessionFilters,
  options: FilterOptions,
): SessionFilters {
  const venues = filters.venues.filter((slug) =>
    options.venues.some((venue) => venue.slug === slug),
  )
  const validFormats = availableFormats(options, venues)
  return {
    ...filters,
    venues,
    formats: filters.formats.filter((slug) => validFormats.some((format) => format.slug === slug)),
    languages: filters.languages.filter((slug) =>
      options.languages.some((language) => language.slug === slug),
    ),
    bands: filters.bands.filter((id) => options.timeBands.some((band) => band.id === id)),
    sort: options.sorts.some((sort) => sort.id === filters.sort)
      ? filters.sort
      : (options.sorts[0]?.id ?? 'time_asc'),
  }
}
export function activeFilterCount(filters: SessionFilters) {
  return listKeys.reduce((count, key) => count + filters[key].length, 0)
}
export function clearSessionFilters(filters: SessionFilters): SessionFilters {
  return { ...filters, venues: [], formats: [], languages: [], bands: [], search: '', page: 1 }
}

export function updateSessionFilters(
  filters: SessionFilters,
  patch: Partial<SessionFilters>,
  options?: FilterOptions,
) {
  const next = { ...filters, ...patch, page: patch.page ?? 1 }
  return options ? normalizeSessionFilters(next, options) : next
}
