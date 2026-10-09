import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@/features/auth/model/auth.types'
import { FormField } from '@/components/ui/form-field/FormField'
import { useFilterOptions } from '@/features/venues/hooks/useFilterOptions'
import { profileSchema, type ProfileValues } from '../model/profile.schema'
import { profileValues } from '../model/profile-values'
import { useProfileSave } from '../hooks/useProfileSave'
import { DateOfBirthField } from './DateOfBirthField'
import { VenueField } from './VenueField'
import styles from './PersonalInformation.module.scss'

export function PersonalInformation({ user }: { user: User }) {
  const options = useFilterOptions()
  const [saved, setSaved] = useState(false)
  const lock = useRef(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors, touchedFields, isDirty },
  } = useForm<ProfileValues>({
    mode: 'onBlur',
    resolver: zodResolver(profileSchema),
    defaultValues: profileValues(user),
  })
  const values = useWatch({ control })
  const { fullName, mobileNumber, dateOfBirth, preferredVenue } = user
  const venueId = preferredVenue?.id
  useEffect(() => {
    reset({
      fullName: fullName ?? '',
      mobileNumber: mobileNumber ?? '',
      dateOfBirth: dateOfBirth ?? '',
      preferredVenueId: venueId ? String(venueId) : '',
    })
  }, [fullName, mobileNumber, dateOfBirth, venueId, reset])
  const { submit, pending, message, clearMessage } = useProfileSave(setError, (updated) => {
    reset(profileValues(updated))
    setSaved(true)
  })
  const ready = isDirty && profileSchema.safeParse(values).success && !Object.keys(errors).length
  function edited(field: keyof ProfileValues) {
    clearErrors(field)
    clearMessage()
    setSaved(false)
  }
  function valid(field: keyof ProfileValues) {
    return Boolean(
      touchedFields[field] &&
      !errors[field] &&
      profileSchema.shape[field].safeParse(values[field]).success,
    )
  }
  const blockedRatings = options.data?.ageRatings
    .filter((rating) => user.age !== null && rating.minAge > user.age)
    .map((rating) => rating.code)
  return (
    <form
      noValidate
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault()
        if (lock.current || pending || !ready) return
        lock.current = true
        void handleSubmit(async (data) => {
          await submit(data)
        })(event).finally(() => {
          lock.current = false
        })
      }}
    >
      <div className={styles.identity}>
        <FormField
          label="Full name"
          autoComplete="name"
          placeholder="Enter your full name"
          disabled={pending}
          error={errors.fullName?.message}
          valid={valid('fullName')}
          {...register('fullName', { onChange: () => edited('fullName') })}
        />
        <FormField
          label="Email"
          type="email"
          value={user.email}
          readOnly
          autoComplete="email"
          hint="Set at registration and cannot be changed"
        />
      </div>
      <div className={styles.details}>
        <FormField
          label="Mobile number"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          placeholder="5XX XXX XXX"
          disabled={pending}
          error={errors.mobileNumber?.message}
          valid={valid('mobileNumber')}
          {...register('mobileNumber', { onChange: () => edited('mobileNumber') })}
        />
        <DateOfBirthField
          autoComplete="bday"
          disabled={pending}
          error={errors.dateOfBirth?.message}
          valid={valid('dateOfBirth')}
          {...register('dateOfBirth', { onChange: () => edited('dateOfBirth') })}
        />
        <VenueField
          venues={options.data?.venues ?? []}
          pending={options.isPending}
          error={options.error}
          onRetry={() => void options.refetch()}
          disabled={pending}
          {...register('preferredVenueId', { onChange: () => edited('preferredVenueId') })}
        />
        {errors.preferredVenueId && (
          <p className={styles.error} role="alert">
            {errors.preferredVenueId.message}
          </p>
        )}
      </div>
      {user.age != null && options.data && (
        <p className={styles.notice}>
          You are {user.age}.{' '}
          {blockedRatings?.length
            ? `You cannot buy tickets for ${blockedRatings.join(' or ')} titles.`
            : 'You can buy tickets for all age ratings.'}
        </p>
      )}
      {message && (
        <p className={styles.error} role="alert">
          {message} Please try saving again.
        </p>
      )}
      {saved && (
        <p className={styles.success} role="status">
          Your profile has been saved.
        </p>
      )}
      <button
        className={styles.save}
        type="submit"
        disabled={!ready || pending}
        aria-busy={pending}
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
