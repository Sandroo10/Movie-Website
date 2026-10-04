import { useEffect, type RefObject } from 'react'
export function useDismissOutside(
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return
    function dismiss(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) onDismiss()
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [ref, onDismiss, enabled])
}
