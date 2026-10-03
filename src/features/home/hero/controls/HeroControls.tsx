import type { Movie } from '@/features/movies/model/movie.types'
import styles from './HeroControls.module.scss'

type HeroControlsProps = {
  movies: Movie[]
  index: number
  onSelect: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

export function HeroControls({ movies, index, onSelect, onPrevious, onNext }: HeroControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.indicators}>
        {movies.map((movie, slideIndex) => (
          <button
            key={movie.id}
            type="button"
            className={`${styles.indicator} ${slideIndex === index ? styles.active : ''}`}
            aria-label={`Show ${movie.title}`}
            aria-current={slideIndex === index ? 'true' : undefined}
            onClick={() => onSelect(slideIndex)}
          >
            <span />
          </button>
        ))}
      </div>
      <div className={styles.arrows}>
        <button
          type="button"
          aria-label="Previous featured film"
          disabled={movies.length < 2}
          onClick={onPrevious}
        >
          <img src="/assets/kino/arrow-left.svg" alt="" />
        </button>
        <button
          type="button"
          aria-label="Next featured film"
          disabled={movies.length < 2}
          onClick={onNext}
        >
          <img className={styles.rightArrow} src="/assets/kino/arrow-left.svg" alt="" />
        </button>
      </div>
    </div>
  )
}
