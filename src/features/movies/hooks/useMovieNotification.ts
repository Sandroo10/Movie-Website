import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError, isApiError } from '@/api/api-error'
import { subscribeToMovie } from '@/features/movies/api/movie-notification'
import type { Movie } from '@/features/movies/model/movie.types'
import { useAuth } from '@/features/auth/session/auth-context'

export function useMovieNotification(slug: string) {
  const { token, openLogin, expireSession } = useAuth()
  const queryClient = useQueryClient()
  const mutationKey = ['movie-notification', slug]
  const pending = useIsMutating({ mutationKey }) > 0
  const mutation = useMutation({
    mutationKey,
    retry: false,
    mutationFn: async (accessToken: string) => {
      if (!accessToken)
        throw new ApiError('Log in to receive notifications for this film.', {
          kind: 'http',
          status: 401,
        })
      const response = await subscribeToMovie(slug, accessToken)
      if (!response.data.subscribed) throw new Error('Unable to subscribe. Please try again.')
      return response.data
    },
    onSuccess: (result) => {
      queryClient.setQueriesData<Movie[]>({ queryKey: ['catalogue', 'coming-soon'] }, (movies) =>
        movies?.map((movie) =>
          movie.id === result.movieId ? { ...movie, isNotified: true } : movie,
        ),
      )
    },
  })

  async function subscribe(accessToken: string) {
    try {
      await mutation.mutateAsync(accessToken)
    } catch (error) {
      if (isApiError(error) && error.status === 401) expireSession(subscribe)
    }
  }

  function notify() {
    if (
      queryClient.isMutating({ mutationKey }) ||
      (token && mutation.isSuccess && mutation.variables === token)
    )
      return
    if (!token) {
      openLogin(subscribe)
      return
    }
    void subscribe(token)
  }

  const message = mutation.error
    ? isApiError(mutation.error) && mutation.error.status === 401
      ? 'Log in to receive notifications for this film.'
      : mutation.error.message
    : null

  return {
    notify,
    pending,
    subscribed: Boolean(token && mutation.isSuccess && mutation.variables === token),
    message,
  }
}
