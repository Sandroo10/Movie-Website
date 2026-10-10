import styles from './RefreshIndicator.module.scss'

export function RefreshIndicator({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return (
    <p role="status" className={`${styles.indicator} ${overlay ? styles.overlay : ''}`}>
      <span aria-hidden="true" />
      {label}
    </p>
  )
}
