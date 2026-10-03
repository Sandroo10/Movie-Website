import { Link } from 'react-router'
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
        <div className={styles.searchArea} role="search">
          <label className={styles.search}>
            <img src="/assets/kino/search.svg" alt="" width="14" height="14" />
            <input type="search" aria-label="Search movies" placeholder="Search" />
          </label>
        </div>
        <div className={styles.authActions}>
          <button className={styles.signUp} type="button">
            Sign up
          </button>
          <button className={styles.logIn} type="button">
            Log in
          </button>
        </div>
      </div>
    </header>
  )
}
