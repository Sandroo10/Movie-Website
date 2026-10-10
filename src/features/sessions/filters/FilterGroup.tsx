import type { ReactNode } from 'react'
import styles from './SessionFilters.module.scss'

export function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className={styles.group}>
      <legend>{title}</legend>
      <div className={styles.choices}>{children}</div>
    </fieldset>
  )
}
export function FilterCheckbox({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string
  detail?: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className={styles.choice}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>
        {label}
        {detail && <small> · {detail}</small>}
      </span>
    </label>
  )
}
