import { Fragment } from 'react'
import type { SeatMap as MapData, Selection } from '../model/booking.types'
import styles from '../modal/BookingModal.module.scss'

export function SeatMap({
  map,
  selection,
  contested,
  pending,
  onToggle,
}: {
  map: MapData
  selection: Selection[]
  contested: string[]
  pending: boolean
  onToggle: (id: number) => void
}) {
  return (
    <div className={styles.map}>
      <div className={styles.screen}>SCREEN</div>
      {!map.sections.length && <p>No seats are available for this hall.</p>}
      {map.sections.map((section, index) => (
        <section key={`${section.name}-${index}`} aria-label={section.name}>
          <h3>
            {section.name} · Rows {section.rows.map((row) => row.label).join(', ')}
          </h3>
          {section.rows.map((row) => (
            <div className={styles.row} key={row.label}>
              <span className={styles.rowLabel}>{row.label}</span>
              {row.seats.map((seat) => {
                const selected = selection.some((item) => item.seatId === seat.id)
                const state = contested.includes(seat.code) ? 'sold' : seat.state
                const blocked = state !== 'available' && !seat.isMine
                return (
                  <Fragment key={seat.id}>
                    <button
                      type="button"
                      className={`${styles.seat} ${selected ? styles.selected : (styles[state] ?? '')}`}
                      disabled={pending || blocked}
                      aria-pressed={selected}
                      aria-label={`Seat ${seat.code}, ${selected ? 'selected' : seat.isMine ? 'held by you' : state}`}
                      onClick={() => onToggle(seat.id)}
                    >
                      {state === 'unavailable' ? '' : seat.label}
                    </button>
                    {seat.aisleAfter && <span className={styles.aisle} aria-hidden="true" />}
                  </Fragment>
                )
              })}
            </div>
          ))}
        </section>
      ))}
      <div className={styles.legend}>
        {[
          ['available', 'Available'],
          ['selected', 'Selected'],
          ['sold', 'Sold'],
          ['held', 'Held by another user'],
          ['unavailable', 'Unavailable'],
        ].map(([state, label]) => (
          <span key={state}>
            <i className={`${styles.seat} ${styles[state]}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
