import { Children, type ReactNode } from 'react'
import { useMovieRail } from './hooks/useMovieRail'
import styles from './MovieRail.module.scss'

export function MovieRail({
  label,
  children,
  variant = 'standard',
}: {
  label: string
  children: ReactNode
  variant?: 'standard' | 'upcoming'
}) {
  const { viewportRef, carousel, canScrollNext } = useMovieRail()

  return (
    <div className={`${styles.rail} ${variant === 'upcoming' ? styles.upcoming : ''}`}>
      <div
        className={styles.viewport}
        ref={viewportRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          const instantly = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            carousel?.scrollNext(instantly)
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            carousel?.scrollPrev(instantly)
          }
        }}
      >
        <div className={styles.track}>
          {Children.map(children, (child) => (
            <div className={styles.slide}>{child}</div>
          ))}
        </div>
      </div>
      {canScrollNext && <div className={styles.edgeFade} aria-hidden="true" />}
    </div>
  )
}
