import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './SearchSkeleton.module.scss'

export function SearchSkeleton() {
  return (
    <SkeletonGroup label="Searching films and events" className={styles.list}>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={styles.row} aria-hidden="true">
          <Skeleton width={40} height={56} radius={6} />
          <div className={styles.copy}>
            <Skeleton width="85%" height={14} />
            <Skeleton width="65%" height={12} />
          </div>
          <Skeleton width={55} height={14} />
        </div>
      ))}
    </SkeletonGroup>
  )
}
