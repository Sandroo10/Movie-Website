import { useQuery } from '@tanstack/react-query'
import { featuredMoviesOptions } from '@/features/home/api/featured-movies'
import { HomeHero } from '@/features/home/hero/HomeHero'
import { HeroState } from '@/features/home/states/HeroState'
import { HeroSkeleton } from '@/features/home/states/skeleton/HomeSkeleton'
import { NowPlayingSection } from '@/features/home/sections/now-playing/NowPlayingSection'
import { ComingSoonSection } from '@/features/home/sections/coming-soon/ComingSoonSection'
import { RecentlyViewedSection } from '@/features/home/sections/recently-viewed/RecentlyViewedSection'
import { useAuth } from '@/features/auth/session/auth-context'

function FeaturedMovies() {
  const movies = useQuery(featuredMoviesOptions)

  if (movies.isPending) return <HeroSkeleton />
  if (movies.isError) {
    return (
      <HeroState message="Unable to load featured films." onRetry={() => void movies.refetch()} />
    )
  }
  if (movies.data.length === 0) {
    return <HeroState message="No featured films available right now." />
  }
  return <HomeHero movies={movies.data} refreshing={movies.isFetching} />
}

export function HomePage() {
  const { user } = useAuth()

  return (
    <main>
      <FeaturedMovies />
      <RecentlyViewedSection userId={user?.id} />
      <NowPlayingSection afterRecent />
      <ComingSoonSection />
    </main>
  )
}
