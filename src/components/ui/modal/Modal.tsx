import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useModalDialog } from './useModalDialog'

export function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  className,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  describedBy?: string
  className?: string
  children: ReactNode
}) {
  const dialog = useModalDialog(open)
  return createPortal(
    <dialog
      ref={dialog}
      className={className}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose()
      }}
    >
      {children}
    </dialog>,
    document.body,
  )
}

export function ModalCloseButton({
  onClose,
  className,
  label,
  icon = false,
  children = 'Close',
}: {
  onClose: () => void
  className?: string
  label?: string
  icon?: boolean
  children?: ReactNode
}) {
  return (
    <button type="button" className={className} aria-label={label} onClick={onClose}>
      {icon ? <img src="/assets/kino/close.svg" alt="" /> : children}
    </button>
  )
}
