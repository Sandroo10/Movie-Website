import type { ReactNode } from 'react'

// Pages provide their layout styles; this component shares the feedback structure.
export function FeedbackState({
  title,
  message,
  onAction,
  actionLabel = 'Retry',
  error = false,
  className,
  children,
  as: Element = 'div',
  label,
}: {
  title?: string
  message: string
  onAction?: () => void
  actionLabel?: string
  error?: boolean
  className?: string
  children?: ReactNode
  as?: 'div' | 'section'
  label?: string
}) {
  return (
    <Element className={className} role={error ? 'alert' : 'status'} aria-label={label}>
      {title && <h2>{title}</h2>}
      <p>{message}</p>
      {onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {children}
    </Element>
  )
}
