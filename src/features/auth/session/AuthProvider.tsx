import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isApiError } from '@/api/api-error'
import { getCurrentUser, revokeSession } from '../api/auth.api'
import type { AuthMode, ProtectedAction, User } from '../model/auth.types'
import { AuthModal } from '../modal/AuthModal'
import { AuthContext } from './auth-context'

const TOKEN_KEY = 'kino:token'
function storedToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
function persistToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* Keep the current tab usable when storage is unavailable. */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState(() => ({ token: storedToken(), revision: 0 }))
  const [mode, setMode] = useState<AuthMode>('login')
  const [open, setOpen] = useState(false)
  const [instance, setInstance] = useState(0)
  const pendingAction = useRef<ProtectedAction | undefined>(undefined)
  const clearSession = useCallback(() => {
    persistToken(null)
    queryClient.removeQueries({ queryKey: ['auth'] })
    queryClient.removeQueries({ queryKey: ['movie-notification'] })
    queryClient.removeQueries({ queryKey: ['profile'] })
    void queryClient.invalidateQueries({ queryKey: ['catalogue'] })
    setSession((current) => ({ token: null, revision: current.revision + 1 }))
  }, [queryClient])
  const openLogin = useCallback((action?: ProtectedAction) => {
    pendingAction.current = action
    setMode('login')
    setInstance((current) => current + 1)
    setOpen(true)
  }, [])
  const expireSession = useCallback(
    (action?: ProtectedAction) => {
      clearSession()
      openLogin(action)
    },
    [clearSession, openLogin],
  )
  const currentUser = useQuery({
    queryKey: ['auth', 'session', session.revision],
    enabled: Boolean(session.token),
    staleTime: 60_000,
    retry: (count, error) => !(isApiError(error) && error.status === 401) && count < 1,
    queryFn: async ({ signal }) => {
      try {
        return await getCurrentUser(session.token!, signal)
      } catch (error) {
        if (isApiError(error) && error.status === 401) clearSession()
        throw error
      }
    },
  })
  function authenticate(user: User, token: string) {
    persistToken(token)
    const revision = session.revision + 1
    queryClient.setQueryData(['auth', 'session', revision], user)
    setSession({ token, revision })
    setOpen(false)
    const action = pendingAction.current
    pendingAction.current = undefined
    if (action)
      void action(token).catch(() => {
        /* The action presents its own error. */
      })
  }
  async function logout() {
    try {
      if (session.token) await revokeSession(session.token)
    } finally {
      clearSession()
    }
  }
  return (
    <AuthContext.Provider
      value={{
        token: session.token,
        revision: session.revision,
        user: session.token ? (currentUser.data ?? null) : null,
        restoring: Boolean(session.token) && currentUser.isPending,
        sessionError: session.token ? currentUser.error : null,
        openLogin,
        openRegister: () => {
          pendingAction.current = undefined
          setMode('register')
          setInstance((current) => current + 1)
          setOpen(true)
        },
        expireSession,
        authenticate,
        updateUser: (user) => {
          queryClient.setQueriesData<User>({ queryKey: ['auth', 'session'] }, (current) =>
            current?.id === user.id ? user : current,
          )
        },
        logout,
        retrySession: () => {
          void currentUser.refetch()
        },
      }}
    >
      {children}
      <AuthModal
        mode={mode}
        open={open}
        instance={instance}
        onSwitch={setMode}
        onClose={() => {
          setOpen(false)
          pendingAction.current = undefined
        }}
      />
    </AuthContext.Provider>
  )
}
