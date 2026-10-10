import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { AccountNavigation } from '@/features/auth/navigation/AccountNavigation'
import { MovieSearch } from '@/features/search/search-box/MovieSearch'
import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    function updateHeaderBackground() {
      frame = 0
      const progress = Math.min(Math.max(window.scrollY / 360, 0), 1)
      const opacity = progress * progress * (3 - 2 * progress)
      header.current?.style.setProperty('--header-opacity', String(opacity))
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateHeaderBackground)
    }

    updateHeaderBackground()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header ref={header} className={styles.header}>
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
