type RoutePlaceholderProps = {
  title: string
}

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <main className="app-shell">
      <h1>{title}</h1>
    </main>
  )
}
