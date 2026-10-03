import styles from './HeroState.module.scss'

export function HeroState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <section className={styles.state} aria-label="Featured films" aria-live="polite">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </section>
  )
}
