import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError, isApiError } from '@/api/api-error'
import { subscribeToMovie } from '@/features/movies/api/movie-notification'
import type { Movie } from '@/features/movies/model/movie.types'

export function useMovieNotification(slug: string, token: string | null = null) {
  const queryClient = useQueryClient()
  const mutationKey = ['movie-notification', slug]
  const pending = useIsMutating({ mutationKey }) > 0
  const mutation = useMutation({
    mutationKey,
    retry: false,
    mutationFn: async () => {
      if (!token)
        throw new ApiError('Log in to receive notifications for this film.', {
          kind: 'http',
          status: 401,
        })
      const response = await subscribeToMovie(slug, token)
      if (!response.data.subscribed) throw new Error('Unable to subscribe. Please try again.')
      return response.data
    },
    onSuccess: (result) => {
      queryClient.setQueryData<Movie[]>(['catalogue', 'coming-soon'], (movies) =>
        movies?.map((movie) =>
          movie.id === result.movieId ? { ...movie, isNotified: true } : movie,
        ),
      )
    },
  })

  function notify() {
    if (queryClient.isMutating({ mutationKey }) || mutation.isSuccess) return
    mutation.mutate()
  }

  const message = mutation.error
    ? isApiError(mutation.error) && mutation.error.status === 401
      ? 'Log in to receive notifications for this film.'
      : mutation.error.message
    : null

  return { notify, pending, subscribed: mutation.isSuccess, message }
}
