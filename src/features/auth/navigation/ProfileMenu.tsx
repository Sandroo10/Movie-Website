import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '@/components/ui/icon/Icon'
import { Avatar } from '@/components/ui/avatar/Avatar'
import { useDismissOutside } from '@/hooks/useDismissOutside'
import { useAuth } from '@/features/auth/session/auth-context'
import { ProfileStatus } from './ProfileStatus'
import type { User } from '@/features/auth/model/auth.types'
import styles from './ProfileMenu.module.scss'
export function ProfileMenu({
  user,
  onLogoutError,
}: {
  user: User
  onLogoutError: (message: string) => void
}) {
  const { logout } = useAuth()
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const logoutPending = useRef(false)
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  useDismissOutside(container, close, open)
  const name = user.fullName || user.username
  const avatar = (size: 'default' | 'menu') => (
    <Avatar name={name} image={user.avatar} complete={user.profileComplete} size={size} />
  )
  async function signOut() {
    if (logoutPending.current) return
    logoutPending.current = true
    setLoggingOut(true)
    try {
      await logout()
    } catch {
      onLogoutError('Signed out on this device. The server could not be reached.')
    } finally {
      logoutPending.current = false
      setLoggingOut(false)
      close()
    }
  }
  return (
    <>
      {open && <div className={styles.menuBackdrop} aria-hidden="true" />}
      <div
        ref={container}
        className={styles.profileContainer}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            close()
            trigger.current?.focus()
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) close()
        }}
      >
        <button
          ref={trigger}
          className={styles.profileTrigger}
          aria-expanded={open}
          aria-controls={open ? 'profile-menu' : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          {avatar('default')}
          <span>{name.split(' ')[0]}</span>
          <Icon name="chevron-down" />
        </button>
        {open && (
          <div id="profile-menu" className={styles.profileMenu}>
            <div className={styles.identity}>
              {avatar('menu')}
              <div>
                <strong>{name}</strong>
                <small>{user.email}</small>
              </div>
            </div>
            <ProfileStatus complete={user.profileComplete} />
            <Link to="/profile" onClick={close}>
              <Icon name="user" />
              My Profile
            </Link>
            <Link to="/profile?tab=tickets" onClick={close}>
              <Icon name="tickets" />
              My Tickets
            </Link>
            <button disabled={loggingOut} className={styles.logout} onClick={() => void signOut()}>
              <Icon name="logout" />
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
