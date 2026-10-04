import { Route, Routes } from 'react-router'
import { RoutePlaceholder } from '@/pages/RoutePlaceholder'
import { HomePage } from '@/pages/home/HomePage'
import { MovieVisitTracker } from '@/features/movies/history/MovieVisitTracker'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sessions" element={<RoutePlaceholder title="Sessions" />} />
      <Route
        path="/movies/:movieId"
        element={
          <>
            <MovieVisitTracker />
            <RoutePlaceholder title="Movie Details" />
          </>
        }
      />
      <Route path="/profile" element={<RoutePlaceholder title="Profile" />} />
      <Route path="*" element={<RoutePlaceholder title="Page Not Found" />} />
    </Routes>
  )
}
