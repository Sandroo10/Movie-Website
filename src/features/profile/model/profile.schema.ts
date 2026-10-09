import { z } from 'zod'

export function birthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null
}

function isAtLeastTwelve(date: Date) {
  const today = new Date()
  const age =
    today.getFullYear() -
    date.getFullYear() -
    (today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
      ? 1
      : 0)
  return age >= 12
}

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  mobileNumber: z.string().superRefine((value, ctx) => {
    const number = value.replace(/\s/g, '')
    let message: string | undefined
    if (!number) message = 'Mobile number is required'
    else if (!/^\d+$/.test(number))
      message = 'Please enter a valid Georgian mobile number (9 digits starting with 5)'
    else if (!number.startsWith('5')) message = 'Georgian mobile numbers must start with 5'
    else if (number.length !== 9) message = 'Mobile number must be exactly 9 digits'
    if (message) ctx.addIssue({ code: 'custom', message })
  }),
  dateOfBirth: z.string().superRefine((value, ctx) => {
    const date = birthDate(value)
    let message: string | undefined
    if (!value) message = 'Date of birth is required'
    else if (!date || date > new Date()) message = 'Please enter a valid date of birth'
    else if (!isAtLeastTwelve(date))
      message = 'You must be at least 12 years old to create an account'
    if (message) ctx.addIssue({ code: 'custom', message })
  }),
  preferredVenueId: z.string(),
})

export type ProfileValues = z.infer<typeof profileSchema>
