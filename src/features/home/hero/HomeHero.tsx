import type { Movie } from '@/features/movies/model/movie.types'
import { HeroContent } from './content/HeroContent'
import { HeroControls } from './controls/HeroControls'
import { useHeroCarousel } from './hooks/useHeroCarousel'
import styles from './HomeHero.module.scss'

export function HomeHero({ movies }: { movies: Movie[] }) {
  const carousel = useHeroCarousel(movies.length)
  const movie = movies[carousel.index]
  if (!movie) return null

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured films"
      onMouseEnter={() => carousel.setHovered(true)}
      onMouseLeave={() => carousel.setHovered(false)}
      onFocusCapture={() => carousel.setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) carousel.setFocused(false)
      }}
    >
      {movies.map((slide, index) =>
        slide.backdropUrl ? (
          <img
            key={slide.id}
            className={`${styles.heroBackdrop} ${index === carousel.index ? styles.activeBackdrop : ''}`}
            src={slide.backdropUrl}
            alt=""
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        ) : null,
      )}
      <div className={styles.heroGradient} aria-hidden="true" />
      <HeroContent key={movie.id} movie={movie} />
      <HeroControls
        movies={movies}
        index={carousel.index}
        onSelect={carousel.select}
        onPrevious={carousel.previous}
        onNext={carousel.next}
      />
    </section>
  )
}
