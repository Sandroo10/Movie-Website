import { useId, type InputHTMLAttributes } from 'react'
import styles from './FormField.module.scss'

export function FormField({
  label,
  error,
  valid,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  valid?: boolean
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
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {(error || valid) && (
          <span className={styles.feedback}>
            <img src={`/assets/kino/field-${error ? 'error' : 'success'}.svg`} alt="" />
          </span>
        )}
      </div>
      {error && (
        <p className={styles.error} id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
