import { Link } from 'react-router'
import type { UseQueryResult } from '@tanstack/react-query'
import type { TicketOrder } from '../model/ticket.types'
import { TicketCard } from './TicketCard'
import { TicketsSkeleton } from '../states/ProfileSkeleton'
import { Skeleton } from '@/components/ui/skeleton/Skeleton'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import styles from './MyTickets.module.scss'

export function MyTickets({
  query,
  past,
  onTab,
}: {
  query: UseQueryResult<TicketOrder[], Error>
  past: boolean
  onTab: (past: boolean) => void
}) {
  const orders = query.data ?? []
  const upcoming = orders.filter((order) => order.isUpcoming)
  const history = orders.filter((order) => !order.isUpcoming)
  const visible = past ? history : upcoming
  return (
    <section aria-label="My tickets" className={styles.section}>
      <nav className={styles.tabs} aria-label="Ticket history">
        <button
          type="button"
          aria-current={!past ? 'page' : undefined}
          onClick={() => onTab(false)}
        >
          Upcoming{' '}
          {query.isPending ? <Skeleton width={16} height={12} /> : <span>{upcoming.length}</span>}
        </button>
        <button type="button" aria-current={past ? 'page' : undefined} onClick={() => onTab(true)}>
          Past{' '}
          {query.isPending ? <Skeleton width={16} height={12} /> : <span>{history.length}</span>}
        </button>
      </nav>
      {query.isPending ? (
        <TicketsSkeleton />
      ) : query.isError ? (
        <FeedbackState
          className={styles.state}
          error
          message={`Unable to load tickets. ${query.error.message}`}
          onAction={() => void query.refetch()}
        />
      ) : !visible.length ? (
        <FeedbackState
          className={styles.state}
          title={past ? 'No past tickets' : 'No upcoming tickets'}
          message={
            past
              ? 'Your previous bookings and refunded orders will appear here.'
              : 'Your next cinema booking will appear here.'
          }
        >
          <Link to="/sessions">Browse sessions</Link>
        </FeedbackState>
      ) : (
        visible.map((order) => <TicketCard key={order.id} order={order} />)
      )}
      {query.isFetching && !query.isPending && <p role="status">Refreshing tickets…</p>}
    </section>
  )
}
