import { useEffect, useId, useRef, useState } from 'react'
import { avatarSchema } from '../../model/register.schema'
import styles from './AvatarUpload.module.scss'

export function AvatarUpload({
  onChange,
  error,
  disabled,
  active,
}: {
  onChange: (file: File | undefined) => void
  error?: string
  disabled: boolean
  active: boolean
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const previewUrl = useRef<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [hasSelection, setHasSelection] = useState(false)
  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    },
    [active],
  )
  function selectFile(file: File | undefined) {
    setHasSelection(Boolean(file))
    onChange(file)
    if (file && !avatarSchema.safeParse(file).success) return
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    previewUrl.current = file ? URL.createObjectURL(file) : null
    setPreview(previewUrl.current)
  }
  return (
    <div className={styles.upload}>
      <div className={styles.row}>
        <label className={styles.picker} htmlFor={id} aria-disabled={disabled}>
          <span className={styles.thumbnail}>
            {preview ? (
              <img className={styles.preview} src={preview} alt="Selected avatar" />
            ) : (
              <img src="/assets/kino/upload-avatar.svg" alt="" />
            )}
          </span>
          <span className={styles.copy}>
            <strong>Upload avatar (optional)</strong>
            <span>JPG, PNG or WEBP</span>
          </span>
        </label>
        {hasSelection && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              selectFile(undefined)
              if (input.current) input.current.value = ''
            }}
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={input}
        className={styles.input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        aria-label="Upload avatar (optional)"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) selectFile(file)
          event.target.value = ''
        }}
      />
      {error && (
        <p className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
