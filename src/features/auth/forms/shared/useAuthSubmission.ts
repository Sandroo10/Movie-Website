import { useEffect, useRef, useState } from 'react'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { isApiError } from '@/api/api-error'
import type { AuthResponse } from '../../model/auth.types'
import { useAuth } from '../../session/auth-context'

export function useAuthSubmission<T extends FieldValues>({
  request: sendRequest,
  fields,
  setError,
  active,
}: {
  request: (values: T, signal: AbortSignal) => Promise<AuthResponse>
  fields: Path<T>[]
  setError: UseFormSetError<T>
  active: boolean
}) {
  const { authenticate } = useAuth()
  const request = useRef<AbortController | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => () => request.current?.abort(), [])
  useEffect(() => {
    if (!active) request.current?.abort()
  }, [active])
  async function submit(values: T) {
    if (!active || request.current) return
    const controller = new AbortController()
    request.current = controller
    setMessage(null)
    try {
      const response = await sendRequest(values, controller.signal)
      if (!controller.signal.aborted) authenticate(response.data.user, response.data.token)
    } catch (error) {
      if (controller.signal.aborted) return
      if (
        isApiError(error) &&
        (error.status === 422 || error.status === 409) &&
        error.payload &&
        typeof error.payload === 'object'
      ) {
        const errors = (error.payload as { errors?: Record<string, string[]> }).errors
        for (const field of fields) {
          if (errors?.[field]?.[0]) setError(field, { type: 'server', message: errors[field][0] })
        }
      }
      setMessage(error instanceof Error ? error.message : 'Unable to submit. Please try again.')
    } finally {
      request.current = null
    }
  }
  return { submit, message, clearMessage: () => setMessage(null) }
}
