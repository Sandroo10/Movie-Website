import { Modal, ModalCloseButton } from '@/components/ui/modal/Modal'
import { LoginForm } from '../forms/login/LoginForm'
import { RegisterForm } from '../forms/register/RegisterForm'
import type { AuthMode } from '../model/auth.types'
import styles from './AuthModal.module.scss'

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
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`${styles.dialog} ${registering ? styles.register : ''}`}
      labelledBy="auth-title"
      describedBy="auth-description"
    >
      <div className={styles.heading}>
        <div>
          <h2 id="auth-title">{registering ? 'Sign up' : 'Log in'}</h2>
          <p id="auth-description">
            {registering ? 'Welcome to Kino XII' : 'Welcome back to Kino XII'}
          </p>
        </div>
        <ModalCloseButton
          icon
          label={registering ? 'Close sign up' : 'Close login'}
          onClose={onClose}
        />
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
      <ModalCloseButton className={styles.close} onClose={onClose} />
    </Modal>
  )
}
