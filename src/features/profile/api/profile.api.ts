import { apiRequest } from '@/api/api-client'
import type { User } from '@/features/auth/model/auth.types'
import type { ProfileValues } from '../model/profile.schema'

export async function saveProfile(values: ProfileValues, token: string) {
  const body = new FormData()
  body.set('fullName', values.fullName)
  body.set('mobileNumber', values.mobileNumber)
  body.set('dateOfBirth', values.dateOfBirth)
  body.set('preferredVenueId', values.preferredVenueId)
  const response = await apiRequest<{ data: User }>('/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  return response.data
}
