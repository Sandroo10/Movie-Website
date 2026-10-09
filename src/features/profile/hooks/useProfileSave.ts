import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormSetError } from 'react-hook-form'
import { isApiError } from '@/api/api-error'
import { useAuth } from '@/features/auth/session/auth-context'
import type { User } from '@/features/auth/model/auth.types'
import { saveProfile } from '../api/profile.api'
import type { ProfileValues } from '../model/profile.schema'

export function useProfileSave(
  setError: UseFormSetError<ProfileValues>,
  onSaved: (user: User) => void,
) {
  const { token, updateUser, expireSession } = useAuth()
  const client = useQueryClient()
  const pending = useIsMutating({ mutationKey: ['profile-save'] }) > 0
  const mutation = useMutation({
    mutationKey: ['profile-save'],
    retry: false,
    mutationFn: ({ values, accessToken }: { values: ProfileValues; accessToken: string }) =>
      saveProfile(values, accessToken),
    onSuccess: (user) => {
      updateUser(user)
      onSaved(user)
    },
    onError: (error) => {
      if (
        isApiError(error) &&
        error.status === 422 &&
        typeof error.payload === 'object' &&
        error.payload
      ) {
        const errors = (error.payload as { errors?: Record<string, string[]> }).errors
        const fields: (keyof ProfileValues)[] = [
          'fullName',
          'mobileNumber',
          'dateOfBirth',
          'preferredVenueId',
        ]
        for (const field of fields) {
          if (errors?.[field]?.[0]) setError(field, { type: 'server', message: errors[field][0] })
        }
      }
    },
  })
  async function submit(values: ProfileValues, accessToken = token) {
    if (!accessToken || client.isMutating({ mutationKey: ['profile-save'] })) return
    try {
      await mutation.mutateAsync({ values, accessToken })
    } catch (error) {
      if (isApiError(error) && error.status === 401)
        expireSession((newToken) => submit(values, newToken))
    }
  }
  return {
    submit,
    pending,
    message: mutation.error?.message,
    clearMessage: mutation.reset,
  }
}
