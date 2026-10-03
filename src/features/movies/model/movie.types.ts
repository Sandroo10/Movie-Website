export type Movie = {
  id: number
  slug: string
  title: string
  kind: 'film' | 'event'
  runtimeMinutes: number
  posterUrl: string | null
  backdropUrl: string | null
  releaseDate: string
  isComingSoon: boolean
  isFeatured: boolean
  isNotified?: boolean
  fromPrice: number
  ageRating: { code: string; minAge: number; description: string }
  genres: { id: number; slug: string; name: string }[]
  formats: { id: number; slug: string; name: string; priceUplift: number }[]
  synopsis?: string
}

export type ApiData<T> = { data: T }
