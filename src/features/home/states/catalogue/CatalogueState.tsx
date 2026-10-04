import styles from './CatalogueState.module.scss'

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
    <div className={`${styles.state} ${compact ? styles.compact : ''}`} role="status">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
