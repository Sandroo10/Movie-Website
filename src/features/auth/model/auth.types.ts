export type User = {
  id: number
  username: string
  email: string
  avatar: string | null
  fullName: string | null
  profileComplete: boolean
}
export type AuthResponse = { data: { user: User; token: string } }
export type ProtectedAction = (token: string) => Promise<void>
export type AuthMode = 'login' | 'register'
