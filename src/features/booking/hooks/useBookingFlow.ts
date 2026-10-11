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
import { bookingEligibility } from '../model/booking-eligibility'
import { seatSelectionDetails, ticketPrice, ticketTypeAllowed } from '../model/seat-selection'
import { bookingErrorDetails } from '../model/booking-error'
import { hasSessionStarted, useSessionStarted } from '@/features/sessions/hooks/useSessionStarted'

type BookingScreen =
  | { step: 'seats'; hold: SeatHold | null }
  | { step: 'checkout'; hold: SeatHold }
  | { step: 'confirmation'; order: BookingOrder }
type RequestStatus = 'idle' | 'holding' | 'paying'

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
  const [screen, setScreen] = useState<BookingScreen>({ step: 'seats', hold: null })
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const pending = requestStatus !== 'idle'
  const hold = screen.step === 'confirmation' ? null : screen.hold
  const order = screen.step === 'confirmation' ? screen.order : null
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
  const selected = seatSelectionDetails(
    selection,
    seatList,
    options.ticketTypes,
    contested,
    session.movie.ageRating.minAge,
  )
  const invalid = selected.some((item) => Boolean(item.problem))
  const subtotal = selected.reduce(
    (sum, { type }) => sum + ticketPrice(session.price, type?.priceRatio ?? 0),
    0,
  )
  const expireHold = useCallback(() => {
    holdGeneration.current += 1
    // Expiry resets selection, but a successful payment response always wins.
    setScreen((current) =>
      current.step === 'confirmation' ? current : { step: 'seats', hold: null },
    )
    setSelection([])
    setFieldErrors({})
    setMessage('Your hold time expired. Please re-select your seats.')
    void client.invalidateQueries({ queryKey: ['booking', 'seats', session.id] })
  }, [client, session.id])
  async function refreshRejectedProfile(accessToken: string) {
    const account = await getCurrentUser(accessToken, new AbortController().signal)
    updateUser(account)
    if (!account.profileComplete || account.age == null) {
      setScreen({ step: 'seats', hold: null })
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
    if (!ticketTypeAllowed(type, session.movie.ageRating.minAge)) {
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
    const details = bookingErrorDetails(error)
    setMessage(details.message)
    setFieldErrors(details.errors)
    if (details.status === 409 && details.contested.length) {
      const codes = details.contested
      setContested(codes)
      setSelection((current) =>
        (current ?? selection).filter(
          (item) => !codes.includes(seatList.find((seat) => seat.id === item.seatId)?.code ?? ''),
        ),
      )
      setScreen({ step: 'seats', hold: null })
      setMessage(
        `These seats were taken: ${codes.join(', ')}. Your other selections have been kept.`,
      )
      await seats.refetch()
    } else if (details.holdExpired) expireHold()
  }
  async function next(accessToken = token, account: User | null = user) {
    if (!accessToken || lock.current || !selection.length || invalid) return
    // Seats already held by this account remain usable when no unheld seats remain.
    const eligibility = bookingEligibility(account, session, {
      allowSoldOut: selected.every((item) => item.seat?.isMine),
    })
    if (!eligibility.allowed) {
      setMessage(eligibility.message)
      if (eligibility.reason === 'profile' && account)
        requestCompletion(session, account.id, onProfileCancel)
      return
    }
    if (!account) return
    lock.current = true
    setRequestStatus('holding')
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
      setScreen({ step: 'checkout', hold: result })
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
        if (bookingErrorDetails(error).profileIncomplete) {
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
      setRequestStatus('idle')
    }
  }
  async function pay(values: CheckoutValues, accessToken = token, account: User | null = user) {
    const eligibility = bookingEligibility(account, session, { allowSoldOut: true })
    if (!eligibility.allowed) {
      setMessage(eligibility.message)
      if (eligibility.reason === 'profile' && account)
        requestCompletion(session, account.id, onProfileCancel)
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
    setRequestStatus('paying')
    setMessage(null)
    setFieldErrors({})
    try {
      const result = await placeOrder(hold.holdId, values, accessToken)
      setScreen({ step: 'confirmation', order: result })
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
      setRequestStatus('idle')
    }
  }
  return {
    started,
    seats,
    selection,
    selected,
    hold,
    order,
    step: screen.step,
    pending,
    requestStatus,
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
      setScreen({ step: 'seats', hold })
      setFieldErrors({})
      void seats.refetch()
    },
  }
}
