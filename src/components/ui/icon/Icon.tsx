type IconName = 'search' | 'close' | 'chevron-down' | 'user' | 'tickets' | 'logout' | 'check'

export function Icon({ name }: { name: IconName }) {
  const file = name === 'check' ? 'field-success' : name
  return <img src={`/assets/kino/${file}.svg`} alt="" />
}
