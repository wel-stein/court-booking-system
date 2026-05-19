import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';

interface BookingEntry {
  id: string;
  court: string;
  courtType: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'past';
  price: number;
}

const bookings: BookingEntry[] = [
  {
    id: 'ACE-8821',
    court: 'Court 04',
    courtType: 'Professional Grade',
    date: 'Mon, 23 Oct 2023',
    time: '09:00 - 10:00',
    duration: '60 mins',
    status: 'upcoming',
    price: 24,
  },
  {
    id: 'ACE-8744',
    court: 'Court 01',
    courtType: 'Premium PVC',
    date: 'Wed, 18 Oct 2023',
    time: '19:00 - 20:30',
    duration: '90 mins',
    status: 'past',
    price: 36,
  },
  {
    id: 'ACE-8690',
    court: 'Court 05',
    courtType: 'Wooden',
    date: 'Sat, 14 Oct 2023',
    time: '08:00 - 09:00',
    duration: '60 mins',
    status: 'past',
    price: 20,
  },
];

export function Bookings() {
  const navigate = useNavigate();
  const upcoming = bookings.filter((b) => b.status === 'upcoming');
  const past = bookings.filter((b) => b.status === 'past');

  return (
    <div className="min-h-dvh bg-surface pb-28 text-on-surface">
      <header className="px-container-padding pt-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              My Calendar
            </p>
            <h1 className="font-display text-display-lg text-primary">Bookings</h1>
          </div>
          <button
            onClick={() => navigate('/book')}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-elevated transition active:scale-95"
            aria-label="new booking"
          >
            <Icon name="add" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-lg">
        <section>
          <div className="mb-sm flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-primary">Upcoming</h2>
            <span className="rounded-full bg-secondary-fixed px-3 py-1 font-label text-label-sm font-bold text-on-secondary-fixed">
              {upcoming.length} active
            </span>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState onBook={() => navigate('/book')} />
          ) : (
            <div className="space-y-sm">
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <div className="mb-sm flex items-center justify-between">
              <h2 className="font-headline text-headline-md text-primary">Past Sessions</h2>
              <button className="font-label text-label-lg text-primary">View all</button>
            </div>
            <div className="space-y-sm">
              {past.map((b) => (
                <BookingCard key={b.id} booking={b} muted />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav active="Bookings" />
    </div>
  );
}

function BookingCard({ booking, muted = false }: { booking: BookingEntry; muted?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-elevated transition active:scale-[0.99] ${
        muted ? 'opacity-80' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="sports_tennis" filled />
          </div>
          <div>
            <p className="font-headline text-headline-md text-primary">{booking.court}</p>
            <p className="font-label text-label-sm text-on-surface-variant">{booking.courtType}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 font-label text-label-sm font-bold uppercase tracking-wider ${
            muted
              ? 'bg-surface-container text-outline'
              : 'bg-secondary-container text-on-secondary-container'
          }`}
        >
          {muted ? 'Completed' : 'Confirmed'}
        </span>
      </div>

      <div className="mt-md grid grid-cols-3 gap-sm">
        <Field icon="calendar_today" value={booking.date} />
        <Field icon="schedule" value={booking.time} />
        <Field icon="timer" value={booking.duration} />
      </div>

      <div className="mt-md flex items-center justify-between border-t border-dashed border-outline-variant/40 pt-md">
        <div>
          <p className="font-label text-label-sm uppercase text-outline">Receipt #{booking.id}</p>
          <p className="font-headline text-headline-md text-primary">${booking.price.toFixed(2)}</p>
        </div>
        {!muted && (
          <button className="flex items-center gap-xs rounded-xl bg-primary px-md py-sm font-label text-label-lg text-on-primary transition active:scale-95">
            <Icon name="qr_code_2" />
            <span>View Pass</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-xs">
      <Icon name={icon} className="text-base text-primary" />
      <span className="font-label text-label-sm text-on-surface-variant">{value}</span>
    </div>
  );
}

function EmptyState({ onBook }: { onBook: () => void }) {
  return (
    <div className="flex flex-col items-center gap-md rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-xl text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name="calendar_today" />
      </div>
      <div>
        <p className="font-headline text-headline-md text-primary">No upcoming bookings</p>
        <p className="font-body text-body-md text-on-surface-variant">
          Reserve a court to see it appear here.
        </p>
      </div>
      <button
        onClick={onBook}
        className="flex items-center gap-xs rounded-full bg-primary px-lg py-sm font-label text-label-lg text-on-primary transition active:scale-95"
      >
        Book a Court
        <Icon name="arrow_forward" />
      </button>
    </div>
  );
}
