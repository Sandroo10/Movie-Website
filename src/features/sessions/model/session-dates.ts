const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tbilisi',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
export function todayInTbilisi(now = new Date()) {
  const parts = dateFormatter.formatToParts(now)
  const part = (type: string) => parts.find((value) => value.type === type)!.value
  return `${part('year')}-${part('month')}-${part('day')}`
}
export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
export function nextSevenDays(start: string) {
  const date = new Date(`${start}T12:00:00Z`)
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(date)
    next.setUTCDate(next.getUTCDate() + index)
    return {
      value: next.toISOString().slice(0, 10),
      day: new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short' }).format(next),
      number: next.getUTCDate(),
    }
  })
}
