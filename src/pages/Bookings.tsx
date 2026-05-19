import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';
import { addMinutes, formatDuration } from '../data/courts';
import { SkillLevelPicker } from '../components/SkillLevelPicker';
import { useInvites, type Invite, type SkillLevel } from '../state/InvitesContext';

interface BookingEntry {
  id: string;
  courtName: string;
  courtType: string;
  dateIso: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  durationMins: number;
  status: 'upcoming' | 'past';
  price: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function longDate(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface BookingSeed {
  id: string;
  courtName: string;
  courtType: string;
  offset: number;
  startTime: string;
  durationMins: number;
  status: 'upcoming' | 'past';
  price: number;
}

const seeds: BookingSeed[] = [
  {
    id: 'ACE-8821',
    courtName: 'Court 04',
    courtType: 'Professional Grade',
    offset: 2,
    startTime: '09:00',
    durationMins: 60,
    status: 'upcoming',
    price: 24,
  },
  {
    id: 'ACE-8744',
    courtName: 'Court 01',
    courtType: 'Premium PVC',
    offset: -3,
    startTime: '19:00',
    durationMins: 90,
    status: 'past',
    price: 36,
  },
  {
    id: 'ACE-8690',
    courtName: 'Court 05',
    courtType: 'Wooden',
    offset: -10,
    startTime: '08:00',
    durationMins: 60,
    status: 'past',
    price: 20,
  },
];

function buildBookings(): BookingEntry[] {
  return seeds.map((s) => {
    const iso = isoOffset(s.offset);
    return {
      id: s.id,
      courtName: s.courtName,
      courtType: s.courtType,
      dateIso: iso,
      dateLabel: shortDate(iso),
      startTime: s.startTime,
      endTime: addMinutes(s.startTime, s.durationMins),
      durationMins: s.durationMins,
      status: s.status,
      price: s.price,
    };
  });
}

function findInviteForBooking(invites: Invite[], userId: string, b: BookingEntry) {
  return invites.find(
    (inv) =>
      inv.hostId === userId &&
      inv.courtName === b.courtName &&
      inv.dateIso === b.dateIso &&
      inv.startTime === b.startTime,
  );
}

export function Bookings() {
  const navigate = useNavigate();
  const bookings = useMemo(() => buildBookings(), []);
  const { invites, currentUserId, createInvite, cancelInvite } = useInvites();
  const [sharingBooking, setSharingBooking] = useState<BookingEntry | null>(null);

  const upcoming = bookings.filter((b) => b.status === 'upcoming');
  const past = bookings.filter((b) => b.status === 'past');

  const handleShare = (
    b: BookingEntry,
    totalPlayers: number,
    skillLevel: SkillLevel,
    notes: string,
  ) => {
    createInvite({
      courtName: b.courtName,
      courtType: b.courtType,
      dateIso: b.dateIso,
      dateLabel: longDate(b.dateIso),
      startTime: b.startTime,
      endTime: b.endTime,
      durationMins: b.durationMins,
      totalPlayers,
      skillLevel,
      notes: notes.trim() || undefined,
    });
    setSharingBooking(null);
  };

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
              {upcoming.map((b) => {
                const linkedInvite = findInviteForBooking(invites, currentUserId, b);
                return (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    invite={linkedInvite}
                    onShare={() => setSharingBooking(b)}
                    onCancelInvite={
                      linkedInvite ? () => cancelInvite(linkedInvite.id) : undefined
                    }
                    onViewInvite={() => navigate('/partners')}
                  />
                );
              })}
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

      {sharingBooking && (
        <ShareInviteSheet
          booking={sharingBooking}
          onClose={() => setSharingBooking(null)}
          onSubmit={(count, skillLevel, notes) =>
            handleShare(sharingBooking, count, skillLevel, notes)
          }
        />
      )}
    </div>
  );
}

function BookingCard({
  booking,
  invite,
  muted = false,
  onShare,
  onCancelInvite,
  onViewInvite,
}: {
  booking: BookingEntry;
  invite?: Invite;
  muted?: boolean;
  onShare?: () => void;
  onCancelInvite?: () => void;
  onViewInvite?: () => void;
}) {
  const isShared = !!invite;
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-surface-container-lowest shadow-elevated transition active:scale-[0.99] ${
        muted ? 'border-outline-variant/20 opacity-80' : isShared ? 'border-primary/40' : 'border-outline-variant/20'
      }`}
    >
      <div className="p-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="sports_tennis" filled />
            </div>
            <div>
              <p className="font-headline text-headline-md text-primary">{booking.courtName}</p>
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
          <Field icon="calendar_today" value={booking.dateLabel} />
          <Field icon="schedule" value={`${booking.startTime} - ${booking.endTime}`} />
          <Field icon="timer" value={formatDuration(booking.durationMins)} />
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

      {!muted && (
        <div className="border-t border-outline-variant/30 bg-surface-container/60 p-md">
          {isShared ? (
            <SharedInviteBanner
              invite={invite}
              onView={onViewInvite}
              onCancel={onCancelInvite}
            />
          ) : (
            <button
              onClick={onShare}
              className="flex w-full items-center justify-between gap-sm rounded-xl bg-secondary-fixed px-md py-sm font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition active:scale-[0.98]"
            >
              <span className="flex items-center gap-sm">
                <Icon name="groups" />
                Open this slot to others
              </span>
              <Icon name="arrow_forward" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SharedInviteBanner({
  invite,
  onView,
  onCancel,
}: {
  invite: Invite;
  onView?: () => void;
  onCancel?: () => void;
}) {
  const filled = invite.joined.length;
  const total = invite.totalPlayers;
  const isFull = filled >= total;
  const ratio = Math.min(100, (filled / total) * 100);
  return (
    <div className="space-y-sm">
      <div className="flex items-center gap-sm">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
            isFull ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-primary text-on-primary'
          }`}
        >
          <Icon name={isFull ? 'lock' : 'groups'} filled />
        </span>
        <div className="flex-1">
          <p className="font-headline text-label-lg leading-tight text-primary">
            {isFull ? 'Court is full' : 'Open invite live'}
          </p>
          <p className="font-label text-label-sm text-on-surface-variant">
            {filled} / {total} players · {isFull ? 'No new joiners' : `${total - filled} slot${total - filled === 1 ? '' : 's'} open`}
          </p>
        </div>
        <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label text-label-sm font-bold uppercase tracking-wider text-on-secondary-container">
          {invite.skillLevel === 'Open' ? 'Open for all' : invite.skillLevel}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className={`h-full transition-all ${isFull ? 'bg-error' : 'bg-primary'}`}
          style={{ width: `${ratio}%` }}
        />
      </div>
      <div className="flex items-center gap-sm">
        <button
          onClick={onView}
          className="flex-1 rounded-xl border border-primary px-md py-sm font-label text-label-lg text-primary transition active:scale-95"
        >
          View on Find Partner
        </button>
        <button
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-error/60 text-error transition active:scale-90"
          aria-label="cancel invite"
        >
          <Icon name="delete_outline" />
        </button>
      </div>
    </div>
  );
}

function ShareInviteSheet({
  booking,
  onClose,
  onSubmit,
}: {
  booking: BookingEntry;
  onClose: () => void;
  onSubmit: (totalPlayers: number, skillLevel: SkillLevel, notes: string) => void;
}) {
  const [count, setCount] = useState(4);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Open');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const slotsLeft = Math.max(0, count - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        onClick={onClose}
        aria-label="close"
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-screen-sm rounded-t-xl bg-surface p-lg shadow-receipt"
      >
        <div className="mx-auto mb-md h-1.5 w-12 rounded-full bg-outline-variant" aria-hidden />
        <header className="mb-md flex items-start justify-between gap-md">
          <div>
            <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              Share booking
            </p>
            <h2 className="font-headline text-headline-md text-primary">Open this slot</h2>
            <p className="font-label text-label-sm text-on-surface-variant">
              {booking.courtName} · {booking.dateLabel} · {booking.startTime} - {booking.endTime}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container active:scale-90"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="space-y-md">
          <div>
            <div className="mb-sm flex items-center justify-between">
              <p className="font-label text-label-lg text-primary">Total players</p>
              <span className="rounded-full bg-secondary-fixed px-3 py-0.5 font-label text-label-sm font-bold text-on-secondary-fixed">
                {slotsLeft} slot{slotsLeft === 1 ? '' : 's'} open
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <button
                onClick={() => setCount(Math.max(2, count - 1))}
                disabled={count <= 2}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary shadow-elevated transition active:scale-90 disabled:opacity-40"
                aria-label="decrease"
              >
                <Icon name="remove" />
              </button>
              <div className="flex flex-1 items-center justify-center rounded-md bg-surface-container py-sm">
                <span className="font-display text-headline-md text-primary">{count}</span>
                <span className="ml-xs font-label text-label-sm text-on-surface-variant">
                  players incl. you
                </span>
              </div>
              <button
                onClick={() => setCount(Math.min(6, count + 1))}
                disabled={count >= 6}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 bg-white text-primary shadow-elevated transition active:scale-90 disabled:opacity-40"
                aria-label="increase"
              >
                <Icon name="add" />
              </button>
            </div>
          </div>

          <SkillLevelPicker value={skillLevel} onChange={setSkillLevel} />

          <label className="block">
            <p className="mb-xs font-label text-label-lg text-primary">
              Note for joiners (optional)
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={140}
              rows={2}
              placeholder="e.g. casual doubles, bring water"
              className="w-full resize-none rounded-md border border-outline-variant bg-white px-sm py-sm font-body text-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-xs text-right font-label text-label-sm text-outline">
              {notes.length}/140
            </p>
          </label>

          <p className="flex items-center gap-xs font-label text-label-sm text-on-surface-variant">
            <Icon name="lock_open" className="text-base text-primary" />
            Stops accepting new players once {count} have joined.
          </p>
        </div>

        <button
          onClick={() => onSubmit(count, skillLevel, notes)}
          className="mt-lg flex w-full items-center justify-center gap-sm rounded-xl bg-primary px-md py-md font-label text-label-lg text-on-primary shadow-elevated transition active:scale-95"
        >
          <Icon name="campaign" />
          Post open invite
        </button>
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
