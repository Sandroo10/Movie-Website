import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useAuth } from '@/features/auth/session/auth-context'
import { Icon } from '@/components/ui/icon/Icon'
import { PersonalInformation } from '@/features/profile/personal-information/PersonalInformation'
import { MyTickets } from '@/features/profile/tickets/MyTickets'
import { useTickets } from '@/features/profile/hooks/useTickets'
import { ProfileSkeleton, TicketsSkeleton } from '@/features/profile/states/ProfileSkeleton'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import styles from './ProfilePage.module.scss'

function getProfileTabLinks(params: URLSearchParams) {
  const personalParams = new URLSearchParams(params)
  personalParams.delete('tab')
  personalParams.delete('history')
  const personalQuery = personalParams.toString()
  const personalUrl = personalQuery ? `/profile?${personalQuery}` : '/profile'

  const ticketParams = new URLSearchParams(personalParams)
  ticketParams.set('tab', 'tickets')
  return { personalUrl, ticketsUrl: `/profile?${ticketParams}` }
}

type ProfileContentProps = {
  auth: ReturnType<typeof useAuth>
  tickets: ReturnType<typeof useTickets>
  isTicketsTab: boolean
  isPastTicketsTab: boolean
  onHistoryChange: (showPast: boolean) => void
}

function ProfileContent({
  auth,
  tickets,
  isTicketsTab,
  isPastTicketsTab,
  onHistoryChange,
}: ProfileContentProps) {
  const { user, restoring, sessionError, openLogin, retrySession } = auth

  if (restoring) {
    if (isTicketsTab) return <TicketsSkeleton />
    return <ProfileSkeleton />
  }
  if (sessionError) {
    return (
      <FeedbackState
        className={styles.state}
        error
        message={`Unable to load your profile. ${sessionError.message}`}
        onAction={retrySession}
      />
    )
  }
  if (!user) {
    return (
      <FeedbackState
        className={styles.state}
        message="Log in to manage your profile and tickets."
        onAction={() => openLogin()}
        actionLabel="Log in"
      />
    )
  }
  if (isTicketsTab) {
    return <MyTickets query={tickets} past={isPastTicketsTab} onTab={onHistoryChange} />
  }
  return (
    <>
      {!user.profileComplete && (
        <div className={`${styles.status} ${styles.incomplete}`} role="status">
          Please complete your profile to enable booking.
        </div>
      )}
      <PersonalInformation key={user.id} user={user} />
    </>
  )
}

export function ProfilePage() {
  const auth = useAuth()
  const { user, token, restoring, openLogin } = auth
  const hasPromptedLogin = useRef(false)

  const [params, setParams] = useSearchParams()
  const isTicketsTab = params.get('tab') === 'tickets'
  const isPastTicketsTab = params.get('history') === 'past'
  const { personalUrl, ticketsUrl } = getProfileTabLinks(params)

  const tickets = useTickets()
  const upcomingOrderCount = tickets.data?.filter((order) => order.isUpcoming).length

  // Open login once when a guest visits the profile page.
  useEffect(() => {
    if (user) hasPromptedLogin.current = true
    if (!token && !restoring && !hasPromptedLogin.current) {
      hasPromptedLogin.current = true
      openLogin()
    }
  }, [user, token, restoring, openLogin])

  function changeTicketHistory(showPast: boolean) {
    const next = new URLSearchParams(params)
    if (showPast) next.set('history', 'past')
    else next.delete('history')
    setParams(next)
  }

  return (
    <main className={styles.page}>
      <header className={`${styles.heading} ${!isTicketsTab ? styles.personalHeading : ''}`}>
        <h1>My Profile</h1>
        {restoring && (
          <SkeletonGroup label="Loading profile sections" className={styles.tabs}>
            <Skeleton width={150} height={32} />
            <Skeleton width={90} height={32} />
          </SkeletonGroup>
        )}
        {user?.profileComplete && (
          <div className={`${styles.status} ${styles.complete}`} role="status">
            Profile Complete <Icon name="check" />
          </div>
        )}
        {user && (
          <nav className={styles.tabs} aria-label="Profile sections">
            <Link to={personalUrl} aria-current={!isTicketsTab ? 'page' : undefined}>
              Personal Information
              {!user.profileComplete && (
                <span className={styles.dot} aria-label="Profile incomplete" />
              )}
            </Link>
            <Link to={ticketsUrl} aria-current={isTicketsTab ? 'page' : undefined}>
              My Tickets
              {upcomingOrderCount !== undefined && (
                <span className={styles.count}>{upcomingOrderCount}</span>
              )}
              {tickets.isPending && <Skeleton width={20} height={18} radius={999} />}
            </Link>
          </nav>
        )}
      </header>
      <ProfileContent
        auth={auth}
        tickets={tickets}
        isTicketsTab={isTicketsTab}
        isPastTicketsTab={isPastTicketsTab}
        onHistoryChange={changeTicketHistory}
      />
    </main>
  )
}
