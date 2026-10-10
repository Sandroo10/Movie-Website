import { useEffect, useState } from 'react'
import { canRefund, refundClosesAt } from '../model/refund-rules'

export function useRefundAvailability(isRefundable: boolean, startsAt: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const refresh = () => {
      const time = Date.now()
      setNow(time)
      clearTimeout(timer)
      const remaining = refundClosesAt(startsAt) - time
      if (Number.isFinite(remaining) && remaining > 0)
        timer = setTimeout(refresh, Math.min(remaining, 2_147_483_647))
    }
    timer = setTimeout(refresh, 0)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [startsAt])
  return canRefund(isRefundable, startsAt, now)
}
