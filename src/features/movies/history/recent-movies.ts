import { useCallback, useSyncExternalStore } from 'react'
import type { Movie } from '@/features/movies/model/movie.types'
import { recentMovieSchema, type RecentMovie } from './recent-movie.types'
const PREFIX = 'kino:recent:'
const LIMIT = 8
const listeners = new Set<() => void>()
const cache = new Map<string, RecentMovie[]>()
const empty: RecentMovie[] = []
function read(key: string) {
  if (cache.has(key)) return cache.get(key)!
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    const movies = Array.isArray(value)
      ? value
          .flatMap((item) => {
            // Accept the original stored shape, then keep only the fields the recent card uses.
            const candidate =
              item && typeof item === 'object'
                ? {
                    ...item,
                    genre: item.genre ?? item.genres?.[0]?.name ?? '',
                    ageRating:
                      typeof item.ageRating === 'string' ? item.ageRating : item.ageRating?.code,
                  }
                : item
            const parsed = recentMovieSchema.safeParse(candidate)
            return parsed.success ? [parsed.data] : []
          })
          .slice(0, LIMIT)
      : []
    cache.set(key, movies)
    return movies
  } catch {
    cache.set(key, empty)
    return empty
  }
}
function notify() {
  listeners.forEach((listener) => listener())
}
function onStorage(event: StorageEvent) {
  if (event.storageArea !== localStorage) return
  if (event.key === null) {
    cache.clear()
    notify()
  } else if (event.key.startsWith(PREFIX)) {
    cache.delete(event.key)
    notify()
  }
}
function subscribe(listener: () => void) {
  if (!listeners.size) window.addEventListener('storage', onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) window.removeEventListener('storage', onStorage)
  }
}
export function useRecentMovies(userId?: number) {
  const key = userId != null ? `${PREFIX}${userId}` : `${PREFIX}guest`
  const movies = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => empty,
  )
  const remember = useCallback(
    (movie: Movie) => {
      const item: RecentMovie = {
        id: movie.id,
        slug: movie.slug,
        title: movie.title,
        posterUrl: movie.posterUrl,
        runtimeMinutes: movie.runtimeMinutes,
        genre: movie.genres[0]?.name ?? '',
        ageRating: movie.ageRating.code,
      }
      const updated = [item, ...read(key).filter((previous) => previous.id !== movie.id)].slice(
        0,
        LIMIT,
      )
      cache.set(key, updated)
      try {
        localStorage.setItem(key, JSON.stringify(updated))
      } catch {
        /* History remains available in this tab. */
      }
      notify()
    },
    [key],
  )
  return { movies, remember }
}
