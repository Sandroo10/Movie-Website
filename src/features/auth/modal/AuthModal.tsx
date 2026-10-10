import { createPortal } from 'react-dom'
import { LoginForm } from '../forms/login/LoginForm'
import { RegisterForm } from '../forms/register/RegisterForm'
import type { AuthMode } from '../model/auth.types'
import styles from './AuthModal.module.scss'
import { useAuthDialog } from './hooks/useAuthDialog'

export function AuthModal({
  mode,
  open,
  instance,
  onSwitch,
  onClose,
}: {
  mode: AuthMode
  open: boolean
  instance: number
  onSwitch: (mode: AuthMode) => void
  onClose: () => void
}) {
  const registering = mode === 'register'
  const dialog = useAuthDialog(open)
  return createPortal(
    <dialog
      ref={dialog}
      className={`${styles.dialog} ${registering ? styles.register : ''}`}
      aria-labelledby="auth-title"
      aria-describedby="auth-description"
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
      <div className={styles.heading}>
        <div>
          <h2 id="auth-title">{registering ? 'Sign up' : 'Log in'}</h2>
          <p id="auth-description">
            {registering ? 'Welcome to Kino XII' : 'Welcome back to Kino XII'}
          </p>
        </div>
        <button
          type="button"
          aria-label={registering ? 'Close sign up' : 'Close login'}
          onClick={onClose}
        >
          <img src="/assets/kino/close.svg" alt="" />
        </button>
      </div>
      {registering ? (
        <RegisterForm
          key={`register-${instance}`}
          active={open}
          onSwitch={() => onSwitch('login')}
        />
      ) : (
        <LoginForm key={`login-${instance}`} active={open} onSwitch={() => onSwitch('register')} />
      )}
      <button type="button" className={styles.close} onClick={onClose}>
        Close
      </button>
    </dialog>,
    document.body,
  )
}
