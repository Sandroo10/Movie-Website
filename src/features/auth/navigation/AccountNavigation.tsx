import { useState } from 'react'
import { ProfileMenu } from './ProfileMenu'
import { AccountSkeleton } from './AccountSkeleton'
import { useAuth } from '../session/auth-context'
import styles from './AccountNavigation.module.scss'

export function AccountNavigation() {
  const { user, token, restoring, sessionError, retrySession, openLogin, openRegister } = useAuth()
  const [logoutError, setLogoutError] = useState<string | null>(null)

  function renderAccountActions() {
    if (restoring) return <AccountSkeleton />
    if (token && sessionError) {
      return (
        <button type="button" onClick={retrySession}>
          Retry session
        </button>
      )
    }
    if (user) return <ProfileMenu user={user} onLogoutError={setLogoutError} />
    return (
      <>
        <button className={styles.signUp} type="button" onClick={openRegister}>
          Sign up
        </button>
        <button type="button" onClick={() => openLogin()}>
          Log in
        </button>
      </>
    )
  }

  return (
    <div className={styles.account}>
      <div className={styles.actions}>{renderAccountActions()}</div>
      {logoutError && (
        <p className={styles.notice} role="alert">
          {logoutError}
        </p>
      )}
    </div>
  )
}
