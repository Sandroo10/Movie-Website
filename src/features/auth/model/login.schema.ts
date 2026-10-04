import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  password: z.string().min(3, 'At least 3 characters'),
})
export type LoginValues = z.infer<typeof loginSchema>
