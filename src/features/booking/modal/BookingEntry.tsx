import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/session/auth-context'
import { useFilterOptions } from '@/features/venues/hooks/useFilterOptions'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import { useSessionStarted } from '@/features/sessions/hooks/useSessionStarted'
import { useProfileCompletion } from '@/features/profile/modal/profile-completion-context'
import { getBookingSession } from '../api/booking.api'
import { bookingEligibility } from '../model/booking-eligibility'
import { useBookingModal } from './booking-context'

export function BookingEntry({ movieSlug }: { movieSlug: string }) {
  const [params, setParams] = useSearchParams()
  const rawId = params.get('session') ?? ''
  const id = /^\d+$/.test(rawId) && Number.isSafeInteger(Number(rawId)) ? Number(rawId) : 0
  const { user, restoring, openLogin } = useAuth()
  const { requestCompletion } = useProfileCompletion()
  const { showBooking } = useBookingModal()
  const prompted = useRef<number | null>(null)
  const profilePrompted = useRef<string | null>(null)
  const options = useFilterOptions()
  const session = useQuery({
    queryKey: ['booking', 'session', id],
    enabled: id > 0,
    queryFn: ({ signal }) => getBookingSession(id, signal),
    staleTime: 30_000,
    retry: 1,
  })
  const matching = session.data?.movie.slug === movieSlug
  // Trigger a new eligibility decision when the start time passes.
  const started = useSessionStarted(session.data?.startsAt ?? '')
  const close = useCallback(() => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete('session')
        return next
      },
      { replace: true },
    )
  }, [setParams])

  useEffect(() => {
    if (!id) {
      prompted.current = null
      profilePrompted.current = null
      return
    }
    if (!session.data || !options.data || !matching || restoring) return
    const eligibility = bookingEligibility(user, session.data)
    if (eligibility.allowed) {
      showBooking(session.data, options.data, close)
    } else if (eligibility.reason === 'login') {
      if (prompted.current !== id) {
        prompted.current = id
        openLogin()
      }
    } else if (eligibility.reason === 'profile' && user) {
      const key = `${id}-${user.id}`
      if (profilePrompted.current !== key) {
        profilePrompted.current = key
        requestCompletion(session.data, user.id, close)
      }
    }
    if (user) prompted.current = id
  }, [
    id,
    session.data,
    options.data,
    matching,
    restoring,
    started,
    user,
    showBooking,
    close,
    openLogin,
    requestCompletion,
  ])

  if (!rawId) return null
  if (!id)
    return (
      <FeedbackState
        error
        message="This session link is invalid."
        onAction={close}
        actionLabel="Close"
      />
    )
  if (session.isPending || options.isPending || restoring)
    return (
      <SkeletonGroup label="Loading booking">
        <Skeleton height={120} />
      </SkeletonGroup>
    )
  if (session.isError || options.isError)
    return (
      <FeedbackState
        error
        message="Unable to load booking details."
        onAction={() => {
          void session.refetch()
          void options.refetch()
        }}
      >
        <button type="button" onClick={close}>
          Close
        </button>
      </FeedbackState>
    )
  if (!matching)
    return (
      <FeedbackState
        error
        message="This session does not belong to this movie."
        onAction={close}
        actionLabel="Close"
      />
    )
  if (!session.data) return null
  const eligibility = bookingEligibility(user, session.data)
  if (eligibility.allowed || eligibility.reason === 'profile') return null
  if (eligibility.reason === 'login')
    return (
      <FeedbackState
        message={eligibility.message}
        onAction={() => openLogin()}
        actionLabel="Log in"
      />
    )
  return <FeedbackState error message={eligibility.message} onAction={close} actionLabel="Close" />
}
