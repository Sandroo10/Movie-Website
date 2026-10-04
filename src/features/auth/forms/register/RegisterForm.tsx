import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@/components/ui/form-field/FormField'
import { registerAccount } from '../../api/auth.api'
import { registerSchema, type RegisterValues } from '../../model/register.schema'
import { AvatarUpload } from '../avatar-upload/AvatarUpload'
import { useAuthSubmission } from '../shared/useAuthSubmission'
import { AuthFormActions } from '../shared/AuthFormActions'
import styles from '../shared/AuthForm.module.scss'
import registerStyles from './RegisterForm.module.scss'

export function RegisterForm({ onSwitch, active }: { onSwitch: () => void; active: boolean }) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    trigger,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterValues>({
    mode: 'onBlur',
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', password_confirmation: '' },
  })
  const values = useWatch({ control })
  const { submit, message, clearMessage } = useAuthSubmission<RegisterValues>({
    request: registerAccount,
    active,
    fields: ['username', 'email', 'password', 'password_confirmation', 'avatar'],
    setError,
  })
  function edited(field: keyof RegisterValues) {
    clearMessage()
    clearErrors(field)
    if (field === 'password' && touchedFields.password_confirmation)
      void trigger('password_confirmation')
  }
  const ready = Boolean(
    values.username?.trim() &&
    values.email?.trim() &&
    values.password &&
    values.password_confirmation &&
    !errors.avatar,
  )
  return (
    <form noValidate className={styles.form} onSubmit={(event) => void handleSubmit(submit)(event)}>
      <AvatarUpload
        active={active}
        disabled={isSubmitting}
        error={errors.avatar?.message}
        onChange={(file) => {
          clearMessage()
          setValue('avatar', file, { shouldValidate: true, shouldDirty: true })
        }}
      />
      <div className={styles.fields}>
        <FormField
          label="Username"
          autoFocus
          placeholder="User"
          autoComplete="username"
          disabled={isSubmitting}
          error={errors.username?.message}
          valid={Boolean(
            touchedFields.username &&
            !errors.username &&
            registerSchema.shape.username.safeParse(values.username).success,
          )}
          {...register('username', { onChange: () => edited('username') })}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          valid={Boolean(
            touchedFields.email &&
            !errors.email &&
            registerSchema.shape.email.safeParse(values.email).success,
          )}
          {...register('email', { onChange: () => edited('email') })}
        />
        <div className={registerStyles.passwords}>
          <FormField
            label="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password?.message}
            valid={Boolean(
              touchedFields.password &&
              !errors.password &&
              registerSchema.shape.password.safeParse(values.password).success,
            )}
            {...register('password', { onChange: () => edited('password') })}
          />
          <FormField
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password_confirmation?.message}
            valid={Boolean(
              touchedFields.password_confirmation &&
              !errors.password_confirmation &&
              values.password_confirmation &&
              values.password_confirmation === values.password,
            )}
            {...register('password_confirmation', {
              onChange: () => edited('password_confirmation'),
            })}
          />
        </div>
      </div>
      {message && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}
      <AuthFormActions mode="register" pending={isSubmitting} ready={ready} onSwitch={onSwitch} />
    </form>
  )
}
