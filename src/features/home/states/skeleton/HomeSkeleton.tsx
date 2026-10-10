import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './HomeSkeleton.module.scss'

export function HeroSkeleton() {
  return (
    <SkeletonGroup label="Loading featured films" className={styles.hero}>
      <div className={styles.heroContent} aria-hidden="true">
        <Skeleton width={180} height={28} radius={999} />
        <Skeleton width="85%" height={48} />
        <Skeleton width="65%" height={48} />
        <div className={styles.row}>
          {[70, 90, 80].map((width) => (
            <Skeleton key={width} width={width} height={28} radius={999} />
          ))}
        </div>
        <Skeleton height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="75%" height={14} />
        <div className={styles.row}>
          <Skeleton width={140} height={44} radius={999} />
          <Skeleton width={145} height={44} radius={999} />
        </div>
      </div>
      <div className={styles.controls} aria-hidden="true">
        <Skeleton width={100} height={8} />
        <Skeleton width={40} height={40} radius={999} />
        <Skeleton width={40} height={40} radius={999} />
      </div>
    </SkeletonGroup>
  )
}

export function CatalogueSkeleton({ upcoming = false }: { upcoming?: boolean }) {
  return (
    <SkeletonGroup
      label={upcoming ? 'Loading upcoming films' : 'Loading now playing films'}
      className={styles.rail}
    >
      {Array.from({ length: upcoming ? 4 : 6 }, (_, index) => (
        <div key={index} aria-hidden="true" className={upcoming ? styles.upcoming : styles.card}>
          <Skeleton width={upcoming ? '100%' : 236} height={upcoming ? 136 : 300} radius={14} />
          <div className={styles.copy}>
            <Skeleton width="80%" height={upcoming ? 12 : 20} />
            <Skeleton width="65%" height={12} />
            <Skeleton width={40} height={22} radius={999} />
            {upcoming ? (
              <Skeleton width={110} height={28} radius={999} />
            ) : (
              <div className={styles.footer}>
                <Skeleton width={55} height={12} />
                <Skeleton width={110} height={36} radius={999} />
              </div>
            )}
          </div>
        </div>
      ))}
    </SkeletonGroup>
  )
}
