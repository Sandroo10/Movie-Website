import { useEffect, useRef } from 'react'

export function useAuthDialog(open: boolean) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current!
    if (!open) {
      element.close()
      return
    }
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      root.style.overflow = previousOverflow
    }
  }, [open])
  return dialog
}
