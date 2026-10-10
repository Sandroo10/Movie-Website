export function refundClosesAt(startsAt: string) {
  return Date.parse(startsAt) - 2 * 60 * 60 * 1000
}

export function canRefund(isRefundable: boolean, startsAt: string, now = Date.now()) {
  const deadline = refundClosesAt(startsAt)
  return isRefundable && Number.isFinite(deadline) && now < deadline
}
