export type ApiErrorKind = 'http' | 'network' | 'configuration'

export type ApiErrorDetails = {
  kind: ApiErrorKind
  status?: number
  statusText?: string
  payload?: unknown
  cause?: unknown
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly statusText?: string
  readonly payload?: unknown

  constructor(message: string, details: ApiErrorDetails) {
    super(message, { cause: details.cause })
    this.name = 'ApiError'
    this.kind = details.kind
    this.status = details.status
    this.statusText = details.statusText
    this.payload = details.payload
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
