import { useQuery } from '@tanstack/react-query'
import { featuredMoviesOptions } from '@/features/home/api/featured-movies'
import { HomeHero } from '@/features/home/hero/HomeHero'
import { HeroState } from '@/features/home/states/HeroState'
import { HeroSkeleton } from '@/features/home/states/skeleton/HomeSkeleton'
import { NowPlayingSection } from '@/features/home/sections/now-playing/NowPlayingSection'
import { ComingSoonSection } from '@/features/home/sections/coming-soon/ComingSoonSection'
import { RecentlyViewedSection } from '@/features/home/sections/recently-viewed/RecentlyViewedSection'
import { useAuth } from '@/features/auth/session/auth-context'

export function HomePage() {
  const movies = useQuery(featuredMoviesOptions)
  const { user } = useAuth()

  return (
    <main>
      {movies.isPending ? (
        <HeroSkeleton />
      ) : movies.isError ? (
        <HeroState message="Unable to load featured films." onRetry={() => void movies.refetch()} />
      ) : movies.data.length === 0 ? (
        <HeroState message="No featured films available right now." />
      ) : (
        <HomeHero movies={movies.data} />
      )}
      {user && <RecentlyViewedSection userId={user.id} />}
      <NowPlayingSection afterRecent={Boolean(user)} />
      <ComingSoonSection />
    </main>
  )
}
