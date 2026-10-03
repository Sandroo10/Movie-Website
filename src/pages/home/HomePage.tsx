import { useQuery } from '@tanstack/react-query'
import { featuredMoviesOptions } from '@/features/home/api/featured-movies'
import { HomeHero } from '@/features/home/hero/HomeHero'
import { HeroState } from '@/features/home/states/HeroState'

export function HomePage() {
  const movies = useQuery(featuredMoviesOptions)

  return (
    <main>
      {movies.isPending ? (
        <HeroState message="Loading featured films…" />
      ) : movies.isError ? (
        <HeroState message="Unable to load featured films." onRetry={() => void movies.refetch()} />
      ) : movies.data.length === 0 ? (
        <HeroState message="No featured films available right now." />
      ) : (
        <HomeHero movies={movies.data} />
      )}
    </main>
  )
}
