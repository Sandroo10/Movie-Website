import { useEffect, useState } from 'react'

export function hasSessionStarted(startsAt: string) {
  const start = Date.parse(startsAt)
  return !Number.isFinite(start) || start <= Date.now()
}

export function useSessionStarted(startsAt: string) {
  const [started, setStarted] = useState(() => hasSessionStarted(startsAt))
  useEffect(() => {
    const refresh = () => setStarted(hasSessionStarted(startsAt))
    const initial = window.setTimeout(refresh, 0)
    const delay = Date.parse(startsAt) - Date.now()
    const timer =
      Number.isFinite(delay) && delay > 0
        ? window.setTimeout(refresh, Math.min(delay + 1, 2_147_483_647))
        : undefined
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearTimeout(initial)
      window.clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [startsAt])
  return started
}
