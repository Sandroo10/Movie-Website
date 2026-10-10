import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './ProfileSkeleton.module.scss'
import ticketStyles from '../tickets/TicketCard.module.scss'

export function ProfileSkeleton() {
  return (
    <SkeletonGroup label="Loading your profile" className={styles.form}>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className={styles.field} aria-hidden="true">
          <Skeleton width={index === 4 ? 180 : 100} height={12} />
          <Skeleton height={40} radius={12} />
          {index === 1 && <Skeleton width={240} height={12} />}
        </div>
      ))}
      <Skeleton width={145} height={44} radius={999} />
    </SkeletonGroup>
  )
}

export function TicketsSkeleton() {
  return (
    <SkeletonGroup label="Loading your tickets" className={styles.tickets}>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={ticketStyles.card} aria-hidden="true">
          <div className={ticketStyles.content}>
            <Skeleton width={100} height={134} radius={10} />
            <div className={styles.ticketCopy}>
              <Skeleton width="75%" height={22} />
              <Skeleton width={95} height={14} />
              <Skeleton width="90%" height={35} />
              <Skeleton width="60%" height={20} />
            </div>
          </div>
          <div className={ticketStyles.stub}>
            <Skeleton width="70%" height={32} />
            <Skeleton height={24} />
            <Skeleton height={36} radius={999} />
            <Skeleton width="80%" height={12} />
          </div>
        </div>
      ))}
    </SkeletonGroup>
  )
}
