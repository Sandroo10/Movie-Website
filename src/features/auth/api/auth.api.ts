import { apiRequest } from '@/api/api-client'
import type { AuthResponse, User } from '../model/auth.types'
import type { LoginValues } from '../model/login.schema'
import type { RegisterValues } from '../model/register.schema'

const authorization = (token: string) => ({ Authorization: `Bearer ${token}` })
export function login(values: LoginValues, signal: AbortSignal) {
  return apiRequest<AuthResponse>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
    signal,
  })
}
export async function getCurrentUser(token: string, signal: AbortSignal) {
  return (await apiRequest<{ data: User }>('/me', { headers: authorization(token), signal })).data
}
export function revokeSession(token: string) {
  return apiRequest('/logout', { method: 'POST', headers: authorization(token) })
}
export function registerAccount(values: RegisterValues, signal: AbortSignal) {
  const body = new FormData()
  body.set('username', values.username)
  body.set('email', values.email)
  body.set('password', values.password)
  body.set('password_confirmation', values.password_confirmation)
  if (values.avatar) body.set('avatar', values.avatar)
  return apiRequest<AuthResponse>('/register', { method: 'POST', body, signal })
}
