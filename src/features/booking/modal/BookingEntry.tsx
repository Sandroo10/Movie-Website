import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/session/auth-context'
import { useFilterOptions } from '@/features/venues/hooks/useFilterOptions'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import { getBookingSession } from '../api/booking.api'
import { useBookingModal } from './booking-context'
import { useSessionStarted } from '@/features/sessions/hooks/useSessionStarted'
import { useProfileCompletion } from '@/features/profile/modal/profile-completion-context'

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
  const started = useSessionStarted(session.data?.startsAt ?? '')
  const complete = Boolean(user?.profileComplete && user.age != null)
  const ageAllowed = Boolean(
    user?.age != null && session.data && user.age >= session.data.movie.ageRating.minAge,
  )
  useEffect(() => {
    if (!id || !session.data || !options.data || !matching || started || !complete || !ageAllowed)
      return
    showBooking(session.data, options.data, () => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          next.delete('session')
          return next
        },
        { replace: true },
      )
    })
  }, [
    id,
    session.data,
    options.data,
    matching,
    started,
    complete,
    ageAllowed,
    showBooking,
    setParams,
  ])
  useEffect(() => {
    if (!id) {
      prompted.current = null
      profilePrompted.current = null
      return
    }
    if (!session.data || !matching || restoring || started || session.data.movie.isComingSoon)
      return
    if (!user) {
      if (prompted.current !== id) {
        prompted.current = id
        openLogin()
      }
    } else {
      prompted.current = id
      if (complete) return
      const profileKey = `${id}-${user.id}`
      if (profilePrompted.current === profileKey) return
      profilePrompted.current = profileKey
      requestCompletion(session.data, user.id, () => {
        setParams(
          (previous) => {
            const next = new URLSearchParams(previous)
            next.delete('session')
            return next
          },
          { replace: true },
        )
      })
    }
  }, [
    id,
    session.data,
    matching,
    restoring,
    started,
    user,
    complete,
    openLogin,
    requestCompletion,
    setParams,
  ])
  function close() {
    const next = new URLSearchParams(params)
    next.delete('session')
    setParams(next, { replace: true })
  }
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
  if (!matching || session.data?.movie.isComingSoon)
    return (
      <FeedbackState
        error
        message="This session does not belong to this movie or is not bookable."
        onAction={close}
        actionLabel="Close"
      />
    )
  if (!session.data || !options.data) return null
  if (started)
    return (
      <FeedbackState
        message="Session started. Booking is no longer available for this showtime."
        onAction={close}
        actionLabel="Close"
      />
    )
  return (
    <>
      {!user && (
        <FeedbackState
          message="Log in to select your seats."
          onAction={() => openLogin()}
          actionLabel="Log in"
        />
      )}
      {user && !ageAllowed && complete && (
        <FeedbackState
          error
          message={`This film is rated ${session.data.movie.ageRating.code}. You cannot buy tickets for it with this account.`}
          onAction={close}
          actionLabel="Close"
        />
      )}
    </>
  )
}
