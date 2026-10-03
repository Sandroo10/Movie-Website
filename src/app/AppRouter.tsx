import { Route, Routes } from 'react-router'
import { RoutePlaceholder } from '@/pages/RoutePlaceholder'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoutePlaceholder title="Movie Website" />} />
      <Route path="/sessions" element={<RoutePlaceholder title="Sessions" />} />
      <Route path="/movies/:movieId" element={<RoutePlaceholder title="Movie Details" />} />
      <Route path="/profile" element={<RoutePlaceholder title="Profile" />} />
      <Route path="*" element={<RoutePlaceholder title="Page Not Found" />} />
    </Routes>
  )
}
