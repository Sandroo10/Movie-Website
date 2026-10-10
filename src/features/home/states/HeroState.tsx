import styles from './HeroState.module.scss'
import { FeedbackState } from '@/components/ui/feedback-state/FeedbackState'

export function HeroState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <FeedbackState
      as="section"
      className={styles.state}
      label="Featured films"
      message={message}
      onAction={onRetry}
      actionLabel="Try again"
      error={Boolean(onRetry)}
    />
  )
}
