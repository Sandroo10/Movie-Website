import styles from './CatalogueState.module.scss'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'

export function CatalogueState({
  message,
  onRetry,
  compact = false,
}: {
  message: string
  onRetry?: () => void
  compact?: boolean
}) {
  return (
    <FeedbackState
      className={`${styles.state} ${compact ? styles.compact : ''}`}
      message={message}
      onAction={onRetry}
      actionLabel="Try again"
      error={Boolean(onRetry)}
    />
  )
}
