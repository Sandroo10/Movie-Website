import { z } from 'zod'
import { loginSchema } from './login.schema'

export const avatarSchema = z
  .file()
  .max(2 * 1024 * 1024, 'Avatar must be 2 MB or smaller.')
  .mime(['image/jpeg', 'image/png', 'image/webp'], 'Choose a JPG, PNG or WEBP image.')

export const registerSchema = loginSchema
  .extend({
    username: z.string().trim().min(3, 'At least 3 characters'),
    password_confirmation: z.string().min(1, 'Confirm your password.'),
    avatar: avatarSchema.optional(),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  })
export type RegisterValues = z.infer<typeof registerSchema>
