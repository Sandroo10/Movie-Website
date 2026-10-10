import styles from './SessionsSkeleton.module.scss'
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'

export function SessionsSkeleton() {
  return (
    <SkeletonGroup label="Loading sessions" className={styles.skeleton}>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} aria-hidden="true">
          <div className={styles.heading}>
            <Skeleton width={56} height={80} />
            <div className={styles.copy}>
              <Skeleton width={190} height={20} />
              <Skeleton width={100} height={14} />
            </div>
          </div>
          <div className={styles.cards}>
            {Array.from({ length: 4 }, (_, card) => (
              <div key={card} className={styles.card}>
                <div className={styles.row}>
                  <Skeleton width={65} height={20} />
                  <Skeleton width={65} height={24} radius={999} />
                </div>
                <Skeleton width="70%" height={12} />
                <div className={styles.row}>
                  <Skeleton width="65%" height={12} />
                  <Skeleton width={30} height={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </SkeletonGroup>
  )
}
