import type { CSSProperties, ReactNode } from 'react'
import styles from './Skeleton.module.scss'

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  className = '',
}: {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.block} ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  )
}

export function SkeletonGroup({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className={className}>
      {children}
    </div>
  )
}
