import { createContext, useContext } from 'react'
import type { Session } from '@/features/sessions/model/session.types'

export const ProfileCompletionContext = createContext<{
  requestCompletion: (session: Session, owner: number, onCancel?: () => void) => void
} | null>(null)

export function useProfileCompletion() {
  const context = useContext(ProfileCompletionContext)
  if (!context) throw new Error('Profile completion requires ProfileCompletionProvider.')
  return context
}
