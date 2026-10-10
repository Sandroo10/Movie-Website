import { useState } from 'react'
import { ProfileMenu } from './ProfileMenu'
import { AccountSkeleton } from './AccountSkeleton'
import { useAuth } from '../session/auth-context'
import styles from './AccountNavigation.module.scss'

export function AccountNavigation() {
  const { user, token, restoring, sessionError, retrySession, openLogin, openRegister } = useAuth()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  return (
    <div className={styles.account}>
      <div className={styles.actions}>
        {restoring ? (
          <AccountSkeleton />
        ) : token && sessionError ? (
          <button type="button" onClick={retrySession}>
            Retry session
          </button>
        ) : user ? (
          <ProfileMenu user={user} onLogoutError={setLogoutError} />
        ) : (
          <>
            <button className={styles.signUp} type="button" onClick={openRegister}>
              Sign up
            </button>
            <button type="button" onClick={() => openLogin()}>
              Log in
            </button>
          </>
        )}
      </div>
      {logoutError && (
        <p className={styles.notice} role="status">
          {logoutError}
        </p>
      )}
    </div>
  )
}
