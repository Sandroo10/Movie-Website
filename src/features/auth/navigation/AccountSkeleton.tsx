import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton/Skeleton'
import styles from './AccountSkeleton.module.scss'

export function AccountSkeleton() {
  return (
    <SkeletonGroup label="Restoring your account" className={styles.account}>
      <Skeleton width={32} height={32} radius={999} />
      <Skeleton width={65} height={14} />
      <Skeleton width={16} height={16} />
    </SkeletonGroup>
  )
}
