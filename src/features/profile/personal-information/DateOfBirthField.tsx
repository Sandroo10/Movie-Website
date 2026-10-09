import { useRef, type InputHTMLAttributes } from 'react'
import { FormField } from '@/components/ui/form-field/FormField'
import styles from './PersonalInformation.module.scss'

export function DateOfBirthField({
  ref,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  ref?: (element: HTMLInputElement | null) => void
  error?: string
  valid?: boolean
}) {
  const input = useRef<HTMLInputElement | null>(null)
  return (
    <FormField
      {...props}
      label="Date of birth"
      type="date"
      className={styles.dateInput}
      ref={(element) => {
        input.current = element
        ref?.(element)
      }}
      suffix={
        <button
          type="button"
          className={styles.calendar}
          disabled={props.disabled}
          aria-label="Choose date of birth"
          onClick={() => {
            input.current?.focus()
            try {
              input.current?.showPicker?.()
            } catch {
              /* The focused date field remains editable. */
            }
          }}
        >
          <img src="/assets/kino/calendar.svg" alt="" />
        </button>
      }
    />
  )
}
