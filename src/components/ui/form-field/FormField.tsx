import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import styles from './FormField.module.scss'

export function FormField({
  label,
  error,
  valid,
  id,
  hint,
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  ref?: Ref<HTMLInputElement>
  error?: string
  valid?: boolean
  hint?: string
  suffix?: ReactNode
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div className={`${styles.field} ${error ? styles.invalid : ''}`}>
      <label htmlFor={inputId}>{label}</label>
      <div className={styles.inputWrap}>
        <input
          {...props}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error && `${inputId}-error`, hint && `${inputId}-hint`].filter(Boolean).join(' ') ||
            undefined
          }
        />
        {(error || valid) && (
          <span className={styles.feedback}>
            <img src={`/assets/kino/field-${error ? 'error' : 'success'}.svg`} alt="" />
          </span>
        )}
        {suffix}
      </div>
      {hint && (
        <p className={styles.hint} id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className={styles.error} id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
