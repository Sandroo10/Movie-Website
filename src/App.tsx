import '@/App.css'
import { AppRouter } from '@/app/AppRouter'
import { SiteHeader } from '@/components/layout/header/SiteHeader'
import { SiteFooter } from '@/components/layout/footer/SiteFooter'

export default function App() {
  return (
    <>
      <SiteHeader />
      <AppRouter />
      <SiteFooter />
    </>
  )
}
