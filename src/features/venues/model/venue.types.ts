export type Venue = {
  id: number
  slug: string
  name: string
  city: string
  formats: { id: number; slug: string; name: string; priceUplift: number }[]
}
