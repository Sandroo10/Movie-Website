import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from '../filters/SessionFilters.module.scss'
import skeletonStyles from './SessionFiltersSkeleton.module.scss'

export function SessionFiltersSkeleton() {
  return (
    <SkeletonGroup label="Loading session filters" className={styles.panel}>
      <h2>Filters</h2>
      {[4, 7, 5, 4, 3].map((count, group) => (
        <div key={group} className={skeletonStyles.group} aria-hidden="true">
          <Skeleton width={90} height={12} />
          {group === 1 ? (
            <div className={skeletonStyles.dates}>
              {Array.from({ length: count }, (_, index) => (
                <Skeleton key={index} width={37} height={54} />
              ))}
            </div>
          ) : (
            Array.from({ length: count }, (_, index) => (
              <div key={index} className={skeletonStyles.choice}>
                <Skeleton width={18} height={18} radius={5} />
                <Skeleton width={index % 2 ? 130 : 170} height={14} />
              </div>
            ))
          )}
        </div>
      ))}
    </SkeletonGroup>
  )
}
