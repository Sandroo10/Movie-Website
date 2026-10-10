import type { FilterOptions } from '@/features/venues/api/filter-options'
import type { Session } from '@/features/sessions/model/session.types'
import type { Seat, Selection } from '../model/booking.types'
import styles from '../modal/BookingModal.module.scss'

export function SeatSummary({
  selected,
  options,
  session,
  subtotal,
  pending,
  invalid,
  onRemove,
  onType,
  onNext,
  errors,
}: {
  selected: (Selection & {
    seat?: Seat
    type?: FilterOptions['ticketTypes'][number]
    problem?: string | null
  })[]
  options: FilterOptions
  session: Session
  subtotal: number
  pending: boolean
  invalid: boolean
  onRemove: (id: number) => void
  onType: (id: number, slug: string) => void
  onNext: () => void
  errors: Record<string, string[]>
}) {
  return (
    <aside className={styles.summary}>
      <h3>Your seats · Max {options.maxSeatsPerOrder}</h3>
      {!selected.length && (
        <p>
          Pick up to {options.maxSeatsPerOrder} seats from the map. Each seat can carry its own
          ticket type.
        </p>
      )}
      <div className={styles.selectedSeats}>
        {selected.map(({ seatId, seat, ticketType, type, problem }, index) => (
          <div className={styles.summaryCard} key={seatId}>
            <div className={styles.line}>
              <span>
                Seat <strong>{seat?.code ?? seatId}</strong>
              </span>
              <strong>
                ₾{(Math.round(session.price * (type?.priceRatio ?? 0) * 100) / 100).toFixed(2)}
              </strong>
              <button
                type="button"
                aria-label={`Remove seat ${seat?.code ?? seatId}`}
                disabled={pending}
                onClick={() => onRemove(seatId)}
              >
                ×
              </button>
            </div>
            <div className={styles.types}>
              {options.ticketTypes
                .filter(
                  (item) =>
                    item.blockedFromRatingAge == null ||
                    session.movie.ageRating.minAge < item.blockedFromRatingAge,
                )
                .map((item) => (
                  <button
                    type="button"
                    key={item.slug}
                    disabled={pending}
                    aria-pressed={ticketType === item.slug}
                    onClick={() => onType(seatId, item.slug)}
                  >
                    {item.name} {Math.round(item.priceRatio * 100)}%
                  </button>
                ))}
            </div>
            {problem && (
              <p role="alert">
                Seat {seat?.code ?? seatId}: {problem}
              </p>
            )}
            {Object.entries(errors)
              .filter(([key]) => key.startsWith(`seats.${index}.`))
              .map(([key, messages]) => (
                <p role="alert" key={key}>
                  Seat {seat?.code}: {messages.join(' ')}
                </p>
              ))}
            {type?.blockedFromRatingAge != null &&
              session.movie.ageRating.minAge >= type.blockedFromRatingAge && (
                <p role="alert">
                  Seat {seat?.code}: this ticket type is not allowed for this age rating.
                </p>
              )}
          </div>
        ))}
      </div>
      <div className={styles.summaryFooter}>
        <div className={styles.total}>
          <span>SUBTOTAL</span>
          <strong>₾{subtotal.toFixed(2)}</strong>
        </div>
        <button
          className={styles.primary}
          type="button"
          disabled={
            !selected.length ||
            pending ||
            invalid ||
            Object.keys(errors).some((key) => key.startsWith('seats'))
          }
          onClick={onNext}
        >
          {pending ? 'Holding seats…' : 'Next: Checkout'}
        </button>
      </div>
    </aside>
  )
}
