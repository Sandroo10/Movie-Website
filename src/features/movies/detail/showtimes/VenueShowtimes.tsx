import type { MovieDetail, VenueShowtimes as VenueGroup } from '../api/movie-detail'
import { ShowtimeCard } from './ShowtimeCard'
import styles from './MovieShowtimes.module.scss'

export function VenueShowtimes({
  group: { venue, sessions },
  movie,
}: {
  group: VenueGroup
  movie: MovieDetail
}) {
  const halls = [...new Map(sessions.map((session) => [session.hall.id, session.hall])).values()]
  return (
    <div className={styles.venue}>
      <h3>{venue.name}</h3>
      <div className={styles.halls}>
        {halls.map((hall) => (
          <div className={styles.hall} key={hall.id}>
            <h4>Hall {hall.name}</h4>
            <div className={styles.tickets}>
              {sessions
                .filter((session) => session.hall.id === hall.id)
                .map((session) => (
                  <ShowtimeCard key={session.id} session={session} movie={movie} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
