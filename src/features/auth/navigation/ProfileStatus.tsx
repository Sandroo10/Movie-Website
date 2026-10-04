import { Icon } from '@/components/ui/icon/Icon'
import styles from './ProfileStatus.module.scss'
export function ProfileStatus({ complete }: { complete: boolean }) {
  return (
    <div
      className={[styles.profileStatus, complete ? styles.complete : styles.incomplete].join(' ')}
    >
      <strong>
        {complete ? (
          <>
            Profile Complete <Icon name="check" />
          </>
        ) : (
          'Profile incomplete'
        )}
      </strong>
      {!complete && <p>Please complete your profile to enable booking</p>}
    </div>
  )
}
