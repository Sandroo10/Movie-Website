import { Link } from 'react-router'
import styles from './SiteFooter.module.scss'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Link className={styles.brand} to="/" aria-label="KINO XII home">
          <span>KINO</span>
          <span className={styles.brandAccent}>XII</span>
        </Link>
        <p className={styles.copyright}>© 2026 Kino XII. All rights reserved.</p>
      </div>
    </footer>
  )
}
