import { useEffect, useId, useRef, useState, type Ref } from 'react'
import { useDismissOutside } from '@/hooks/useDismissOutside'
import styles from './Select.module.scss'

type Option = { value: string; label: string }

export function Select({
  value,
  options,
  onChange,
  onBlur,
  disabled,
  label,
  id,
  describedBy,
  ref,
}: {
  value: string
  options: Option[]
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  label: string
  id?: string
  describedBy?: string
  ref?: Ref<HTMLButtonElement>
}) {
  const generatedId = useId()
  const listId = `${generatedId}-options`
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const list = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  useDismissOutside(container, () => setOpen(false), open)
  useEffect(() => {
    if (open) list.current?.focus()
  }, [open])
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])
  function close() {
    setOpen(false)
    trigger.current?.focus()
  }
  function choose(index: number) {
    const option = options[index]
    if (option) onChange(option.value)
    close()
  }
  function show() {
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    )
    setOpen(true)
  }
  return (
    <div
      ref={container}
      className={styles.select}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false)
          onBlur?.()
        }
      }}
    >
      <button
        type="button"
        id={id}
        ref={(element) => {
          trigger.current = element
          if (typeof ref === 'function') ref(element)
          else if (ref) ref.current = element
        }}
        className={styles.trigger}
        disabled={disabled}
        aria-label={label}
        aria-describedby={describedBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            show()
          }
        }}
      >
        <span>{options.find((option) => option.value === value)?.label ?? 'Select an option'}</span>
        <img src="/assets/kino/chevron-down.svg" alt="" />
      </button>
      {open && !disabled && (
        <div
          ref={list}
          id={listId}
          className={styles.options}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={options[active] ? `${listId}-${active}` : undefined}
          onKeyDown={(event) => {
            if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(event.key))
              event.preventDefault()
            if (event.key === 'ArrowDown')
              setActive((index) => Math.min(options.length - 1, index + 1))
            if (event.key === 'ArrowUp') setActive((index) => Math.max(0, index - 1))
            if (event.key === 'Home') setActive(0)
            if (event.key === 'End') setActive(options.length - 1)
            if (event.key === 'Enter' || event.key === ' ') choose(active)
            if (event.key === 'Escape') {
              event.stopPropagation()
              close()
            }
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${index === active ? styles.active : ''}`}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              <span aria-hidden="true">{option.value === value ? '✓' : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
