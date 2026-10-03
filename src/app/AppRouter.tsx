import { Route, Routes } from 'react-router'
import { RoutePlaceholder } from '@/pages/RoutePlaceholder'
import { HomePage } from '@/pages/home/HomePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sessions" element={<RoutePlaceholder title="Sessions" />} />
      <Route path="/movies/:movieId" element={<RoutePlaceholder title="Movie Details" />} />
      <Route path="/profile" element={<RoutePlaceholder title="Profile" />} />
      <Route path="*" element={<RoutePlaceholder title="Page Not Found" />} />
    </Routes>
  )
}
