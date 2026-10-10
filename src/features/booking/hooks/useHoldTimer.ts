import { useEffect, useState } from 'react'
export function useHoldTimer(expiresAt: string | undefined, onExpired: () => void) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!expiresAt) return
    let expired = false
    const tick = () => {
      const time = Date.now()
      setNow(time)
      if (Date.parse(expiresAt) <= time && !expired) {
        expired = true
        onExpired()
      }
    }
    const interval = window.setInterval(tick, 1000)
    const firstTick = window.setTimeout(tick, 0)
    const expiryTick = window.setTimeout(tick, Math.max(0, Date.parse(expiresAt) - Date.now()))
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(firstTick)
      window.clearTimeout(expiryTick)
    }
  }, [expiresAt, onExpired])
  const seconds = expiresAt ? Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000)) : 0
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
