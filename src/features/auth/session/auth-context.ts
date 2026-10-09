import { createContext, useContext } from 'react'
import type { ProtectedAction, User } from '../model/auth.types'

export const AuthContext = createContext<{
  token: string | null
  revision: number
  user: User | null
  restoring: boolean
  sessionError: Error | null
  openLogin: (action?: ProtectedAction) => void
  openRegister: () => void
  expireSession: (action?: ProtectedAction) => void
  authenticate: (user: User, token: string) => void
  updateUser: (user: User) => void
  logout: () => Promise<void>
  retrySession: () => void
} | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
