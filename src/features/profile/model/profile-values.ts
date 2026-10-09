import type { User } from '@/features/auth/model/auth.types'
import type { ProfileValues } from './profile.schema'

export function profileValues(user: User): ProfileValues {
  return {
    fullName: user.fullName ?? '',
    mobileNumber: user.mobileNumber ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : '',
  }
}
