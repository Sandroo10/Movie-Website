import { Link } from 'react-router'
import type { UseQueryResult } from '@tanstack/react-query'
import type { TicketOrder } from '../model/ticket.types'
import { TicketCard } from './TicketCard'
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
          Upcoming <span>{query.data ? upcoming.length : '…'}</span>
        </button>
        <button type="button" aria-current={past ? 'page' : undefined} onClick={() => onTab(true)}>
          Past <span>{query.data ? history.length : '…'}</span>
        </button>
      </nav>
      {query.isPending ? (
        <p role="status">Loading your tickets…</p>
      ) : query.isError ? (
        <div className={styles.state} role="alert">
          <p>Unable to load tickets. {query.error.message}</p>
          <button type="button" onClick={() => void query.refetch()}>
            Retry
          </button>
        </div>
      ) : !visible.length ? (
        <div className={styles.state}>
          <h2>{past ? 'No past tickets' : 'No upcoming tickets'}</h2>
          <p>
            {past
              ? 'Your previous bookings and refunded orders will appear here.'
              : 'Your next cinema booking will appear here.'}
          </p>
          <Link to="/sessions">Browse sessions</Link>
        </div>
      ) : (
        visible.map((order) => <TicketCard key={order.id} order={order} />)
      )}
      {query.isFetching && !query.isPending && <p role="status">Refreshing tickets…</p>}
    </section>
  )
}
