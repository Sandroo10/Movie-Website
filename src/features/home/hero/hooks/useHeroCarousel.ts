import { useEffect, useState } from 'react'

export function useHeroCarousel(count: number) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const index = count ? selectedIndex % count : 0

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (hovered || focused || reducedMotion || count < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setSelectedIndex((previous) => (previous + 1) % count)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [hovered, focused, reducedMotion, count, selectedIndex])

  return {
    index,
    select: setSelectedIndex,
    previous: () => setSelectedIndex((index - 1 + count) % count),
    next: () => setSelectedIndex((index + 1) % count),
    setHovered,
    setFocused,
  }
}
