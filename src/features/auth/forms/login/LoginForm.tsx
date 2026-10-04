import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@/components/ui/form-field/FormField'
import { loginSchema, type LoginValues } from '../../model/login.schema'
import { login } from '../../api/auth.api'
import { useAuthSubmission } from '../shared/useAuthSubmission'
import { AuthFormActions } from '../shared/AuthFormActions'
import styles from '../shared/AuthForm.module.scss'

export function LoginForm({ onSwitch, active }: { onSwitch: () => void; active: boolean }) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<LoginValues>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const values = useWatch({ control })
  const { submit, message, clearMessage } = useAuthSubmission<LoginValues>({
    request: login,
    fields: ['email', 'password'],
    setError,
    active,
  })
  const edited = (field: keyof LoginValues) => {
    clearMessage()
    clearErrors(field)
  }
  const hasValues = Boolean(values.email?.trim() && values.password)
  return (
    <form noValidate className={styles.form} onSubmit={(event) => void handleSubmit(submit)(event)}>
      <div className={styles.fields}>
        <FormField
          label="Email"
          autoFocus
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          valid={Boolean(
            touchedFields.email &&
            !errors.email &&
            loginSchema.shape.email.safeParse(values.email).success,
          )}
          {...register('email', { onChange: () => edited('email') })}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          valid={Boolean(
            touchedFields.password &&
            !errors.password &&
            loginSchema.shape.password.safeParse(values.password).success,
          )}
          {...register('password', { onChange: () => edited('password') })}
        />
      </div>
      {message && (
        <p role="alert" className={styles.error}>
          {message}
        </p>
      )}
      <AuthFormActions mode="login" pending={isSubmitting} ready={hasValues} onSwitch={onSwitch} />
    </form>
  )
}
