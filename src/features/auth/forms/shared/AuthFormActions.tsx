import type { AuthMode } from '../../model/auth.types'
import styles from './AuthForm.module.scss'

export function AuthFormActions({
  mode,
  pending,
  ready,
  onSwitch,
}: {
  mode: AuthMode
  pending: boolean
  ready: boolean
  onSwitch: () => void
}) {
  const registering = mode === 'register'
  return (
    <div className={styles.actions}>
      <button className={styles.submit} type="submit" disabled={!ready || pending}>
        {pending
          ? registering
            ? 'Creating account…'
            : 'Logging in…'
          : registering
            ? 'Sign up'
            : 'Log in'}
      </button>
      <p className={styles.switch}>
        {registering ? 'Already have an account?' : "Don't have an account?"}
        <button type="button" disabled={pending} onClick={onSwitch}>
          {registering ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}
