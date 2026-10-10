import { useFilterOptions } from '@/features/venues/hooks/useFilterOptions'
import { useAuth } from '@/features/auth/session/auth-context'
import { useSessionFilters } from '@/features/sessions/hooks/useSessionFilters'
import { useSessionSelection } from '@/features/sessions/hooks/useSessionSelection'
import { useSessions } from '@/features/sessions/hooks/useSessions'
import { SessionFilters } from '@/features/sessions/filters/SessionFilters'
import { SessionsToolbar } from '@/features/sessions/toolbar/SessionsToolbar'
import { SessionMovieGroup } from '@/features/sessions/groups/SessionMovieGroup'
import { SessionsPagination } from '@/features/sessions/pagination/SessionsPagination'
import { SessionsSkeleton } from '@/features/sessions/states/SessionsSkeleton'
import { SessionFiltersSkeleton } from '@/features/sessions/states/SessionFiltersSkeleton'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'
import toolbarStyles from '@/features/sessions/toolbar/SessionsToolbar.module.scss'
import styles from './SessionsPage.module.scss'

export function SessionsPage() {
  const options = useFilterOptions()
  const { user } = useAuth()
  const { filters, change, clear } = useSessionFilters(options.data)
  const query = useSessions(filters, Boolean(options.data))
  const { select: selectSession, message } = useSessionSelection()
  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <div>
          <h1>Sessions</h1>
          <p>Browse showtimes across all venues</p>
        </div>
      </header>
      {options.isPending ? (
        <div className={styles.layout}>
          <SessionFiltersSkeleton />
          <div className={styles.results}>
            <SkeletonGroup label="Loading session summary" className={toolbarStyles.toolbar}>
              <Skeleton width={150} height={16} />
              <Skeleton width={190} height={16} />
            </SkeletonGroup>
            <SessionsSkeleton />
          </div>
        </div>
      ) : options.isError ? (
        <FeedbackState
          className={styles.state}
          error
          title="Unable to load filters"
          message={options.error.message}
          onAction={() => void options.refetch()}
        />
      ) : (
        <div className={styles.layout}>
          <SessionFilters
            options={options.data!}
            filters={filters}
            onChange={change}
            onClear={clear}
          />
          <section
            className={styles.results}
            aria-label="Session results"
            aria-busy={query.isFetching}
          >
            {message && <p role="alert">{message}</p>}
            <SessionsToolbar
              options={options.data!}
              sort={filters.sort}
              total={query.data?.meta.totalSessions}
              onSort={(sort) => change({ sort })}
            />
            {query.isPending ? (
              <SessionsSkeleton />
            ) : query.isError ? (
              <FeedbackState
                className={styles.state}
                error
                title="Unable to load sessions"
                message={query.error.message}
                onAction={() => void query.refetch()}
              />
            ) : !query.data?.data.length ? (
              <FeedbackState
                className={styles.state}
                title="No sessions found"
                message="Try another date or clear your filters."
                onAction={clear}
                actionLabel="Clear All Filters"
              >
                {filters.page > 1 && (
                  <button type="button" onClick={() => change({ page: 1 })}>
                    Return to page 1
                  </button>
                )}
              </FeedbackState>
            ) : (
              <>
                <div className={styles.groups}>
                  {query.data.data.map((group) => (
                    <SessionMovieGroup
                      key={group.movie.id}
                      group={group}
                      age={user?.age}
                      onSelect={selectSession}
                    />
                  ))}
                </div>
                <SessionsPagination
                  current={query.data.meta.currentPage}
                  last={query.data.meta.lastPage}
                  onChange={(page) => change({ page })}
                />
              </>
            )}
            {query.isFetching && !query.isPending && (
              <p className={styles.refreshing} role="status">
                Refreshing sessions…
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
