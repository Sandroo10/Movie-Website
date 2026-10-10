import { useEffect, useRef } from 'react'

const scrollLocks = new Set<symbol>()
let previousOverflow = ''
function lockScroll() {
  const key = Symbol('modal-scroll-lock')
  const root = document.documentElement
  if (!scrollLocks.size) previousOverflow = root.style.overflow
  scrollLocks.add(key)
  root.style.overflow = 'hidden'
  return () => {
    scrollLocks.delete(key)
    if (!scrollLocks.size) root.style.overflow = previousOverflow
  }
}

export function useAuthDialog(open: boolean) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current!
    if (!open) {
      element.close()
      return
    }
    const unlockScroll = lockScroll()
    element.showModal()
    return () => {
      element.close()
      unlockScroll()
    }
  }, [open])
  return dialog
}
