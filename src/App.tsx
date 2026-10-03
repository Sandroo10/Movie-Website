import '@/App.css'
import { AppRouter } from '@/app/AppRouter'
import { SiteHeader } from '@/components/layout/header/SiteHeader'

export default function App() {
  return (
    <>
      <SiteHeader />
      <AppRouter />
    </>
  )
}
