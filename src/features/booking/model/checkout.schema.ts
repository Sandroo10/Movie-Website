import { z } from 'zod'
import { profileSchema } from '@/features/profile/model/profile.schema'
export const checkoutSchema = z.object({
  fullName: profileSchema.shape.fullName,
  email: z.string().trim().email('Please enter a valid email address'),
  mobileNumber: profileSchema.shape.mobileNumber,
  cardNumber: z
    .string()
    .refine(
      (value) => /^\d{16}$/.test(value.replace(/\s/g, '')),
      'Card number must contain 16 digits',
    ),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Enter expiry as MM/YY')
    .refine((value) => {
      const [month, year] = value.split('/').map(Number)
      return new Date(2000 + year, month, 1).getTime() > Date.now()
    }, 'Card expiry must be in the future'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must contain 3 digits'),
})
export type CheckoutValues = z.infer<typeof checkoutSchema>
