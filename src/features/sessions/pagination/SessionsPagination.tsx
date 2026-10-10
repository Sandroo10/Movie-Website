import { paginationPages } from '../model/pagination'
import styles from './SessionsPagination.module.scss'

export function SessionsPagination({
  current,
  last,
  onChange,
}: {
  current: number
  last: number
  onChange: (page: number) => void
}) {
  return (
    <div className={styles.pagination}>
      <nav aria-label="Sessions pages">
        <button
          type="button"
          className={styles.arrow}
          disabled={current <= 1}
          aria-label="Previous page"
          onClick={() => onChange(current - 1)}
        >
          <img src="/assets/kino/pagination-left.svg" alt="" />
        </button>
        {paginationPages(current, last).map((page, index) =>
          page === 'ellipsis' ? (
            <span className={styles.ellipsis} key={`gap-${index}`}>
              …
            </span>
          ) : (
            <button
              type="button"
              key={page}
              aria-label={`Page ${page}`}
              aria-current={page === current ? 'page' : undefined}
              onClick={() => onChange(page)}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          disabled={current >= last}
          aria-label="Next page"
          onClick={() => onChange(current + 1)}
        >
          <img src="/assets/kino/pagination-left.svg" alt="" />
        </button>
      </nav>
      <p>
        Page {current} of {last}
      </p>
    </div>
  )
}
