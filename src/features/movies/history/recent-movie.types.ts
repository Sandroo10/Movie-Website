import { z } from 'zod'
export const recentMovieSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  posterUrl: z.string().nullable(),
  runtimeMinutes: z.number(),
  genre: z.string(),
  ageRating: z.string(),
})
export type RecentMovie = z.infer<typeof recentMovieSchema>
