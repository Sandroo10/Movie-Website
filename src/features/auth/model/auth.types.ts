import type { Venue } from '@/features/venues/model/venue.types'

export type User = {
  id: number
  username: string
  email: string
  avatar: string | null
  fullName: string | null
  mobileNumber: string | null
  dateOfBirth: string | null
  age: number | null
  preferredVenue: Venue | null
  profileComplete: boolean
}
export type AuthResponse = { data: { user: User; token: string } }
export type ProtectedAction = (token: string, user: User) => Promise<void>
export type AuthMode = 'login' | 'register'
