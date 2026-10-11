import { isApiError } from '@/api/api-error'
export function bookingErrorDetails(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Unable to complete your request. Please try again.'
  const status = isApiError(error) ? error.status : undefined
  const payload =
    isApiError(error) && error.payload && typeof error.payload === 'object'
      ? (error.payload as Record<string, unknown>)
      : {}
  const errors: Record<string, string[]> = {}
  if (payload.errors && typeof payload.errors === 'object') {
    for (const [key, value] of Object.entries(payload.errors)) {
      if (Array.isArray(value))
        errors[key] = value.filter((item): item is string => typeof item === 'string')
    }
  }
  const contested = Array.isArray(payload.contested)
    ? payload.contested.filter((item): item is string => typeof item === 'string')
    : []
  return {
    message,
    status,
    errors,
    contested,
    holdExpired: status === 422 && !Object.keys(errors).length && /hold.*expired/i.test(message),
    profileIncomplete: status === 422 && /profile|full.?name|mobile|date.?of.?birth/i.test(message),
  }
}
