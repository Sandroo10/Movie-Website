import styles from './Avatar.module.scss'
export function Avatar({
  name,
  image,
  complete,
  size = 'default',
}: {
  name: string
  image?: string | null
  complete?: boolean
  size?: 'default' | 'menu'
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  return (
    <span className={[styles.avatar, size === 'menu' ? styles.menuAvatar : ''].join(' ')}>
      {image ? <img src={image} alt="" className={styles.avatarImage} /> : initials}
      {complete !== undefined && (
        <img
          className={styles.statusDot}
          src={`/assets/kino/status-${complete ? 'complete' : 'incomplete'}.svg`}
          alt={complete ? 'Profile complete' : 'Profile incomplete'}
        />
      )}
    </span>
  )
}
