import { Link } from 'react-router'
import { AccountNavigation } from '@/features/auth/navigation/AccountNavigation'
import { MovieSearch } from '@/features/search/search-box/MovieSearch'
import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation} aria-label="Main navigation">
        <Link className={styles.brand} to="/" aria-label="KINO XII home">
          <span>KINO</span>
          <span className={styles.brandAccent}>XII</span>
        </Link>
        <Link className={styles.sessionsLink} to="/sessions">
          SESSIONS
        </Link>
      </nav>

      <div className={styles.actions}>
        <MovieSearch />
        <AccountNavigation />
      </div>
    </header>
  )
}
