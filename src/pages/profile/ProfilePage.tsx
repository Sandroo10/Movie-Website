import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useAuth } from '@/features/auth/session/auth-context'
import { Icon } from '@/components/ui/icon/Icon'
import { PersonalInformation } from '@/features/profile/personal-information/PersonalInformation'
import { MyTickets } from '@/features/profile/tickets/MyTickets'
import { useTickets } from '@/features/profile/hooks/useTickets'
import { useProfileContinuation } from '@/features/profile/hooks/useProfileContinuation'
import { ProfileSkeleton, TicketsSkeleton } from '@/features/profile/states/ProfileSkeleton'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './ProfilePage.module.scss'

export function ProfilePage() {
  const { user, token, restoring, sessionError, openLogin, retrySession } = useAuth()
  const prompted = useRef(false)
  const [params, setParams] = useSearchParams()
  const tickets = useTickets()
  const continuationMessage = useProfileContinuation(user)
  const ticketsTab = params.get('tab') === 'tickets'
  const past = params.get('history') === 'past'
  const personalParams = new URLSearchParams(params)
  personalParams.delete('tab')
  personalParams.delete('history')
  const ticketParams = new URLSearchParams(personalParams)
  ticketParams.set('tab', 'tickets')
  const personalUrl = `/profile${personalParams.size ? `?${personalParams}` : ''}`
  useEffect(() => {
    if (user) prompted.current = true
    if (!token && !restoring && !prompted.current) {
      prompted.current = true
      openLogin()
    }
  }, [user, token, restoring, openLogin])
  const ticketCount = tickets.data?.filter((order) => order.isUpcoming).length
  return (
    <main className={styles.page}>
      <header className={`${styles.heading} ${!ticketsTab ? styles.personalHeading : ''}`}>
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
            <Link to={personalUrl} aria-current={!ticketsTab ? 'page' : undefined}>
              Personal Information
              {!user.profileComplete && (
                <span className={styles.dot} aria-label="Profile incomplete" />
              )}
            </Link>
            <Link to={`/profile?${ticketParams}`} aria-current={ticketsTab ? 'page' : undefined}>
              My Tickets
              {ticketCount !== undefined && <span className={styles.count}>{ticketCount}</span>}
              {tickets.isPending && <Skeleton width={20} height={18} radius={999} />}
            </Link>
          </nav>
        )}
      </header>
      {continuationMessage && (
        <div className={styles.state} role="status">
          <p>{continuationMessage}</p>
          <Link to="/sessions">Browse sessions</Link>
        </div>
      )}
      {restoring ? (
        ticketsTab ? (
          <TicketsSkeleton />
        ) : (
          <ProfileSkeleton />
        )
      ) : sessionError ? (
        <div className={styles.state} role="alert">
          <p>Unable to load your profile. {sessionError.message}</p>
          <button onClick={retrySession}>Retry</button>
        </div>
      ) : !user ? (
        <div className={styles.state}>
          <p>Log in to manage your profile and tickets.</p>
          <button onClick={() => openLogin()}>Log in</button>
        </div>
      ) : ticketsTab ? (
        <MyTickets
          query={tickets}
          past={past}
          onTab={(showPast) => {
            const next = new URLSearchParams(params)
            if (showPast) next.set('history', 'past')
            else next.delete('history')
            setParams(next)
          }}
        />
      ) : (
        <>
          {!user.profileComplete && (
            <div className={`${styles.status} ${styles.incomplete}`} role="status">
              Please complete your profile to enable booking.
            </div>
          )}
          <PersonalInformation key={user.id} user={user} />
        </>
      )}
    </main>
  )
}
