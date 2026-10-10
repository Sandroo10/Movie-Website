import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@/components/ui/form-field/FormField'
import type { User } from '@/features/auth/model/auth.types'
import { checkoutSchema, type CheckoutValues } from '../model/checkout.schema'
import styles from '../modal/BookingModal.module.scss'

export function CheckoutForm({
  user,
  pending,
  errors: serverErrors,
  onPay,
  onBack,
}: {
  user: User
  pending: boolean
  errors: Record<string, string[]>
  onPay: (values: CheckoutValues) => Promise<void>
  onBack: () => void
}) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<CheckoutValues>({
    mode: 'onBlur',
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user.fullName ?? '',
      email: user.email,
      mobileNumber: user.mobileNumber ?? '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  })
  const values = useWatch({ control })
  useEffect(() => {
    for (const field of Object.keys(checkoutSchema.shape) as (keyof CheckoutValues)[]) {
      if (serverErrors[field]?.[0])
        setError(field, { type: 'server', message: serverErrors[field][0] })
    }
  }, [serverErrors, setError])
  const fields: {
    name: keyof CheckoutValues
    label: string
    placeholder: string
    inputMode?: 'numeric' | 'tel' | 'email'
    autoComplete: string
    maxLength?: number
  }[] = [
    {
      name: 'fullName',
      label: 'Full name',
      placeholder: 'Enter your full name',
      autoComplete: 'name',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      inputMode: 'email',
      autoComplete: 'email',
    },
    {
      name: 'mobileNumber',
      label: 'Mobile number',
      placeholder: '555 123 456',
      inputMode: 'tel',
      autoComplete: 'tel-national',
    },
    {
      name: 'cardNumber',
      label: 'Card number',
      placeholder: '1234 5678 9012 3456',
      inputMode: 'numeric',
      autoComplete: 'cc-number',
      maxLength: 19,
    },
    {
      name: 'expiry',
      label: 'Expiry',
      placeholder: 'MM/YY',
      inputMode: 'numeric',
      autoComplete: 'cc-exp',
      maxLength: 5,
    },
    {
      name: 'cvv',
      label: 'CVV',
      placeholder: '123',
      inputMode: 'numeric',
      autoComplete: 'cc-csc',
      maxLength: 3,
    },
  ]
  return (
    <form id="booking-checkout" className={styles.form} noValidate onSubmit={handleSubmit(onPay)}>
      <div className={styles.fields}>
        {fields.map(({ name, ...props }) => (
          <div
            key={name}
            className={name === 'fullName' || name === 'cardNumber' ? styles.wide : undefined}
          >
            <FormField
              {...props}
              type={name === 'email' ? 'email' : name === 'cvv' ? 'password' : 'text'}
              disabled={pending || isSubmitting}
              error={errors[name]?.message}
              valid={Boolean(
                touchedFields[name] &&
                !errors[name] &&
                checkoutSchema.shape[name].safeParse(values[name]).success,
              )}
              {...register(name, { onChange: () => clearErrors(name) })}
            />
          </div>
        ))}
      </div>
      <p className={styles.muted}>Payment is simulated for this project.</p>
      <div className={styles.formActions}>
        <button type="button" onClick={onBack} disabled={pending || isSubmitting}>
          Back to seats
        </button>
        <button
          className={styles.primary}
          type="submit"
          disabled={pending || isSubmitting || !checkoutSchema.safeParse(values).success}
        >
          {pending || isSubmitting ? 'Completing order…' : 'Pay & Complete Order'}
        </button>
      </div>
    </form>
  )
}
