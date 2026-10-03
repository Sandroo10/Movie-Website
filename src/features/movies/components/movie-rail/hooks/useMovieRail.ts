import { useCallback, useSyncExternalStore } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function useMovieRail() {
  const [viewportRef, carousel] = useEmblaCarousel({ align: 'start', dragFree: true, loop: false })
  const subscribe = useCallback(
    (notify: () => void) => {
      carousel?.on('select', notify).on('reInit', notify)
      return () => {
        carousel?.off('select', notify).off('reInit', notify)
      }
    },
    [carousel],
  )
  const canScrollNext = useSyncExternalStore(
    subscribe,
    () => carousel?.canScrollNext() ?? false,
    () => false,
  )

  return { viewportRef, carousel, canScrollNext }
}
