import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import type { ReactNode } from 'react'
import { AuthProvider } from '@/features/auth/session/AuthProvider'
import { ProfileCompletionProvider } from '@/features/profile/modal/ProfileCompletionProvider'
import { BookingProvider } from '@/features/booking/modal/BookingProvider'

const queryClient = new QueryClient()

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProfileCompletionProvider>
            <BookingProvider>{children}</BookingProvider>
          </ProfileCompletionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
