import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isApiError } from '@/api/api-error'
import { useAuth } from '@/features/auth/session/auth-context'
import { getCurrentUser } from '@/features/auth/api/auth.api'
import { useProfileCompletion } from '@/features/profile/modal/profile-completion-context'
import type { User } from '@/features/auth/model/auth.types'
import type { Session } from '@/features/sessions/model/session.types'
import type { FilterOptions } from '@/features/venues/api/filter-options'
import { getSeatMap, holdSeats, placeOrder } from '../api/booking.api'
import type { BookingOrder, SeatHold, Selection } from '../model/booking.types'
import type { CheckoutValues } from '../model/checkout.schema'
import { hasSessionStarted, useSessionStarted } from '@/features/sessions/hooks/useSessionStarted'

export function useBookingFlow(
  session: Session,
  options: FilterOptions,
  onProfileCancel: () => void,
) {
  const { token, user, revision, expireSession, updateUser } = useAuth()
  const { requestCompletion } = useProfileCompletion()
  const client = useQueryClient()
  const started = useSessionStarted(session.startsAt)
  const [draft, setSelection] = useState<Selection[] | null>(null)
  const [hold, setHold] = useState<SeatHold | null>(null)
  const [order, setOrder] = useState<BookingOrder | null>(null)
  const [checkout, setCheckout] = useState(false)
  const [pending, setPending] = useState(false)
  const [operation, setOperation] = useState<'hold' | 'payment' | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [contested, setContested] = useState<string[]>([])
  const lock = useRef(false)
  const owner = useRef(user?.id)
  const holdGeneration = useRef(0)
  const seats = useQuery({
    queryKey: ['booking', 'seats', session.id, user?.id, revision],
    enabled: Boolean(token && user),
    queryFn: ({ signal }) => getSeatMap(session.id, token!, signal),
    retry: (count, error) => !(isApiError(error) && error.status === 401) && count < 1,
    staleTime: 10_000,
  })
  const seatList =
    seats.data?.sections.flatMap((section) => section.rows.flatMap((row) => row.seats)) ?? []
  const adult = options.ticketTypes.find((type) => type.slug === 'adult')
  // Existing owned seats can be re-held; ticket choices default to Adult until the new hold confirms prices.
  const selection =
    draft ??
    (adult
      ? seatList
          .filter((seat) => seat.isMine)
          .map((seat) => ({ seatId: seat.id, ticketType: adult.slug }))
      : [])
  const selected = selection.map((item) => ({
    ...item,
    seat: seatList.find((seat) => seat.id === item.seatId),
    type: options.ticketTypes.find((type) => type.slug === item.ticketType),
    problem: (() => {
      const seat = seatList.find((seat) => seat.id === item.seatId)
      if (!seat) return 'This seat is no longer on the hall map. Remove it and select another seat.'
      if (contested.includes(seat.code) || seat.state === 'sold')
        return 'This seat has been sold. Remove it and select another seat.'
      if (seat.state === 'held' && !seat.isMine)
        return 'This seat is held by another customer. Remove it and select another seat.'
      if (seat.state === 'unavailable')
        return 'This seat is unavailable. Remove it and select another seat.'
      if (!options.ticketTypes.some((type) => type.slug === item.ticketType))
        return 'This ticket type is no longer available. Choose another ticket type.'
      return null
    })(),
  }))
  const invalid = selected.some(
    ({ seat, type, problem }) =>
      Boolean(problem) ||
      !seat ||
      !type ||
      contested.includes(seat.code) ||
      (seat.state !== 'available' && !seat.isMine) ||
      (type.blockedFromRatingAge != null &&
        session.movie.ageRating.minAge >= type.blockedFromRatingAge),
  )
  const subtotal = selected.reduce(
    (sum, { type }) => sum + Math.round(session.price * (type?.priceRatio ?? 0) * 100) / 100,
    0,
  )
  const expireHold = useCallback(() => {
    holdGeneration.current += 1
    setHold(null)
    setCheckout(false)
    setSelection([])
    setFieldErrors({})
    setMessage('Your hold time expired. Please re-select your seats.')
    void client.invalidateQueries({ queryKey: ['booking', 'seats', session.id] })
  }, [client, session.id])
  async function refreshRejectedProfile(accessToken: string) {
    const account = await getCurrentUser(accessToken, new AbortController().signal)
    updateUser(account)
    if (!account.profileComplete || account.age == null) {
      setHold(null)
      setCheckout(false)
      requestCompletion(session, account.id, onProfileCancel)
    }
  }
  useEffect(() => {
    if (token && isApiError(seats.error) && seats.error.status === 401) expireSession()
  }, [token, seats.error, expireSession])
  function toggle(seatId: number) {
    if (pending || hasSessionStarted(session.startsAt)) return
    const existing = selection.some((item) => item.seatId === seatId)
    if (existing) {
      setSelection(selection.filter((item) => item.seatId !== seatId))
      setFieldErrors({})
      setMessage(null)
      return
    }
    const seat = seatList.find((item) => item.id === seatId)
    if (!seat || contested.includes(seat.code) || (seat.state !== 'available' && !seat.isMine))
      return
    if (!existing && selection.length >= options.maxSeatsPerOrder) {
      setMessage(`You can select up to ${options.maxSeatsPerOrder} seats per order.`)
      return
    }
    const adult = options.ticketTypes.find((type) => type.slug === 'adult')
    if (!adult) {
      setMessage('Adult ticket pricing is unavailable. Please reload booking options.')
      return
    }
    setSelection(
      existing
        ? selection.filter((item) => item.seatId !== seatId)
        : [...selection, { seatId, ticketType: adult.slug }],
    )
    setMessage(null)
    setFieldErrors({})
  }
  function ticketType(seatId: number, slug: string) {
    if (pending || hasSessionStarted(session.startsAt)) return
    const type = options.ticketTypes.find((item) => item.slug === slug)
    if (
      !type ||
      (type.blockedFromRatingAge != null &&
        session.movie.ageRating.minAge >= type.blockedFromRatingAge)
    ) {
      setMessage('This ticket type is not allowed for this film.')
      return
    }
    setSelection(
      selection.map((item) => (item.seatId === seatId ? { ...item, ticketType: slug } : item)),
    )
    setFieldErrors({})
    setMessage(null)
  }
  async function recover(error: unknown) {
    setMessage(
      error instanceof Error ? error.message : 'Unable to complete your request. Please try again.',
    )
    if (!isApiError(error) || !error.payload || typeof error.payload !== 'object') return
    const payload = error.payload as { contested?: string[]; errors?: Record<string, string[]> }
    setFieldErrors(payload.errors ?? {})
    if (error.status === 409 && Array.isArray(payload.contested)) {
      const codes = payload.contested
      setContested(codes)
      setSelection((current) =>
        (current ?? selection).filter(
          (item) => !codes.includes(seatList.find((seat) => seat.id === item.seatId)?.code ?? ''),
        ),
      )
      setHold(null)
      setCheckout(false)
      setMessage(
        `These seats were taken: ${codes.join(', ')}. Your other selections have been kept.`,
      )
      await seats.refetch()
    } else if (error.status === 422 && !payload.errors && /hold.*expired/i.test(error.message))
      expireHold()
  }
  async function next(accessToken = token, account: User | null = user) {
    if (hasSessionStarted(session.startsAt)) {
      setMessage('Session started. Booking is no longer available for this showtime.')
      return
    }
    if (!accessToken || lock.current || !selection.length || invalid) return
    if (
      !account?.profileComplete ||
      account.age == null ||
      account.age < session.movie.ageRating.minAge
    ) {
      setMessage('Complete your profile and meet the age requirement before booking.')
      if (account && (!account.profileComplete || account.age == null))
        requestCompletion(session, account.id, onProfileCancel)
      return
    }
    lock.current = true
    setPending(true)
    setOperation('hold')
    setMessage(null)
    setFieldErrors({})
    owner.current = account.id
    const generation = holdGeneration.current
    try {
      const result = await holdSeats(session.id, selection, accessToken)
      if (hasSessionStarted(session.startsAt)) {
        setMessage('Session started. Booking is no longer available for this showtime.')
        void seats.refetch()
        return
      }
      if (generation !== holdGeneration.current) {
        void seats.refetch()
        return
      }
      if (!result.isLive || Date.parse(result.expiresAt) <= Date.now()) {
        expireHold()
        return
      }
      setHold(result)
      setCheckout(true)
      setSelection(
        result.seats.map((seat) => ({ seatId: seat.seatId, ticketType: seat.ticketType.slug })),
      )
      void client.invalidateQueries({ queryKey: ['catalogue'] })
      void client.invalidateQueries({ queryKey: ['booking', 'seats', session.id] })
    } catch (error) {
      if (isApiError(error) && error.status === 401)
        expireSession(async (newToken, account) => {
          if (account.id === owner.current) await next(newToken, account)
          else setMessage('Please sign in with the account that started this booking.')
        })
      else {
        await recover(error)
        if (
          isApiError(error) &&
          error.status === 422 &&
          /profile|full.?name|mobile|date.?of.?birth/i.test(error.message)
        ) {
          try {
            await refreshRejectedProfile(accessToken)
          } catch (refreshError) {
            if (isApiError(refreshError) && refreshError.status === 401) {
              expireSession(async (newToken, account) => {
                if (account.id === owner.current) {
                  updateUser(account)
                  if (!account.profileComplete || account.age == null)
                    requestCompletion(session, account.id, onProfileCancel)
                  else await next(newToken, account)
                }
              })
            } else
              setMessage('Unable to refresh your profile. Please try holding your seats again.')
          }
        }
      }
    } finally {
      lock.current = false
      setPending(false)
      setOperation(null)
    }
  }
  async function pay(values: CheckoutValues, accessToken = token, account: User | null = user) {
    if (hasSessionStarted(session.startsAt)) {
      setMessage('Session started. Booking is no longer available for this showtime.')
      return
    }
    if (!accessToken || !hold || lock.current) return
    if (account?.id !== owner.current) {
      setMessage('Please sign in with the account that started this booking.')
      return
    }
    if (Date.parse(hold.expiresAt) <= Date.now()) {
      expireHold()
      return
    }
    lock.current = true
    setPending(true)
    setOperation('payment')
    setMessage(null)
    setFieldErrors({})
    try {
      const result = await placeOrder(hold.holdId, values, accessToken)
      setOrder(result)
      setHold(null)
      void client.invalidateQueries({ queryKey: ['profile', 'tickets'] })
      void client.invalidateQueries({ queryKey: ['catalogue'] })
      void client.invalidateQueries({ queryKey: ['booking', 'seats', session.id] })
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        // Keep the interrupted submission only in memory until authentication resumes it.
        expireSession(async (newToken, account) => {
          if (account.id === owner.current) await pay(values, newToken, account)
          else setMessage('Please sign in with the account that started this booking.')
        })
      } else await recover(error)
    } finally {
      lock.current = false
      setPending(false)
      setOperation(null)
    }
  }
  return {
    started,
    seats,
    selection,
    selected,
    hold,
    order,
    checkout,
    pending,
    operation,
    message,
    fieldErrors,
    contested,
    subtotal,
    invalid,
    toggle,
    ticketType,
    next,
    pay,
    expireHold,
    back: () => {
      setCheckout(false)
      setFieldErrors({})
      void seats.refetch()
    },
  }
}
