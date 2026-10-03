import { ApiError } from '@/api/api-error'

function getApiUrl(path: string): URL {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (!configuredBaseUrl) {
    throw new ApiError('The API base URL is not configured.', {
      kind: 'configuration',
    })
  }

  const baseUrl = configuredBaseUrl.endsWith('/') ? configuredBaseUrl : `${configuredBaseUrl}/`

  try {
    return new URL(path.replace(/^\/+/, ''), baseUrl)
  } catch (cause) {
    throw new ApiError('The configured API base URL is invalid.', {
      kind: 'configuration',
      cause,
    })
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getErrorMessage(payload: unknown, status: number, statusText: string): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>
    const message = [data.message, data.error, data.detail, data.title].find(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    if (message) {
      return message
    }
  }

  return `Request failed (${status}${statusText ? ` ${statusText}` : ''}).`
}

export async function apiRequest<TResponse>(
  path: string,
  init: RequestInit = {},
): Promise<TResponse> {
  const url = getApiUrl(path)
  const headers = new Headers(init.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(url, { ...init, headers })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause
    }

    throw new ApiError('Unable to reach the server. Check your connection and try again.', {
      kind: 'network',
      cause,
    })
  }

  let payload: unknown

  try {
    payload = await readResponseBody(response)
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause
    }

    throw new ApiError('The server response could not be read. Please try again.', {
      kind: 'network',
      cause,
    })
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, response.status, response.statusText), {
      kind: 'http',
      status: response.status,
      statusText: response.statusText,
      payload,
    })
  }

  return payload as TResponse
}
