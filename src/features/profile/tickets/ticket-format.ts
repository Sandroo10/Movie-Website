import { refundClosesAt } from '../model/refund-rules'

const day = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tbilisi',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})
const time = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tbilisi',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
export function sessionDate(value: string) {
  const date = new Date(value)
  return `${day.format(date)} · ${time.format(date)}`
}
export function refundDeadline(value: string) {
  const date = new Date(refundClosesAt(value))
  return `${time.format(date)}, ${day.format(date)}`
}
export function ticketPrice(value: number) {
  return `₾${new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(value)}`
}
