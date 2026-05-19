import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { inviteStatus, useInvites, type Invite, type SkillLevel } from '../state/InvitesContext';
import { formatDuration } from '../data/courts';

type FilterKey = 'all' | 'open' | 'joined' | 'hosted' | 'full';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'joined', label: 'Joined' },
  { key: 'hosted', label: 'Hosted by me' },
  { key: 'full', label: 'Full' },
];

const skillStyle: Record<SkillLevel, string> = {
  Open: 'bg-secondary-container text-on-secondary-container',
  Beginner: 'bg-secondary-container text-on-secondary-container',
  Intermediate: 'bg-primary-fixed text-on-primary-fixed',
  Advanced: 'bg-primary text-on-primary',
  Pro: 'bg-tertiary-container text-on-tertiary-container',
};

const avatarTones = [
  'bg-secondary-fixed text-on-secondary-fixed',
  'bg-primary-fixed text-on-primary-fixed',
  'bg-tertiary-fixed text-on-tertiary-fixed',
  'bg-secondary-container text-on-secondary-container',
  'bg-primary-container text-on-primary-container',
];

export function FindPartner() {
  const navigate = useNavigate();
  const { invites, currentUserId, joinInvite, leaveInvite, cancelInvite } = useInvites();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const sorted = useMemo(
    () => [...invites].sort((a, b) => a.dateIso.localeCompare(b.dateIso) || a.startTime.localeCompare(b.startTime)),
    [invites],
  );

  const filtered = useMemo(() => {
    return sorted.filter((inv) => {
      const { isHost, isJoined, isFull } = inviteStatus(inv, currentUserId);
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'open'
            ? !isFull
            : filter === 'joined'
              ? isJoined && !isHost
              : filter === 'hosted'
                ? isHost
                : isFull;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === '' ||
        inv.hostName.toLowerCase().includes(q) ||
        inv.courtName.toLowerCase().includes(q) ||
        inv.courtType.toLowerCase().includes(q) ||
        inv.notes?.toLowerCase().includes(q) ||
        inv.skillLevel.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [sorted, currentUserId, filter, query]);

  const counts = useMemo(() => {
    let open = 0;
    let joined = 0;
    let hosted = 0;
    let full = 0;
    invites.forEach((inv) => {
      const s = inviteStatus(inv, currentUserId);
      if (!s.isFull) open += 1;
      if (s.isJoined && !s.isHost) joined += 1;
      if (s.isHost) hosted += 1;
      if (s.isFull) full += 1;
    });
    return { open, joined, hosted, full };
  }, [invites, currentUserId]);

  return (
    <div className="min-h-dvh bg-surface pb-28 text-on-surface">
      <PageHeader
        subtitle="Find Partner"
        title="Open court invites"
        trailing={{
          icon: 'add',
          label: 'create invite',
          onClick: () => navigate('/book'),
        }}
      />

      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-lg">
        <section className="grid grid-cols-3 gap-gutter rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-md shadow-elevated">
          <Stat label="Open" value={counts.open} highlight />
          <Stat label="Joined" value={counts.joined} />
          <Stat label="Hosted" value={counts.hosted} />
        </section>

        <section>
          <label className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-sm shadow-elevated focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Icon name="search" className="text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by court, host, or skill…"
              className="w-full bg-transparent font-body text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="clear">
                <Icon name="close" className="text-on-surface-variant" />
              </button>
            )}
          </label>
        </section>

        <section className="-mx-container-padding">
          <div className="hide-scrollbar flex gap-sm overflow-x-auto px-container-padding">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 rounded-full px-md py-xs font-label text-label-lg transition active:scale-95 ${
                    active
                      ? 'bg-primary text-on-primary shadow-elevated'
                      : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-primary">
              {filter === 'all'
                ? 'All invites'
                : filter === 'open'
                  ? 'Open to join'
                  : filter === 'joined'
                    ? 'You joined'
                    : filter === 'hosted'
                      ? 'Hosted by you'
                      : 'Full'}
            </h2>
            <span className="font-label text-label-sm text-on-surface-variant">
              {filtered.length} found
            </span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onCreate={() => navigate('/book')} />
          ) : (
            <ul className="space-y-sm">
              {filtered.map((inv, i) => (
                <li key={inv.id}>
                  <InviteCard
                    invite={inv}
                    currentUserId={currentUserId}
                    tone={avatarTones[i % avatarTones.length]}
                    onJoin={() => joinInvite(inv.id)}
                    onLeave={() => leaveInvite(inv.id)}
                    onCancel={() => cancelInvite(inv.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-primary p-lg text-on-primary shadow-elevated">
          <p className="font-label text-label-sm uppercase tracking-widest opacity-80">
            Hosting a session?
          </p>
          <h3 className="mt-xs font-headline text-headline-md">Share your booking</h3>
          <p className="mt-xs font-body text-body-md text-on-primary-container">
            Book a court and toggle "Open this slot" on the summary screen. Your invite shows up here automatically.
          </p>
          <button
            onClick={() => navigate('/book')}
            className="mt-md inline-flex items-center gap-xs rounded-full bg-secondary-fixed px-lg py-sm font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition active:scale-95"
          >
            <Icon name="add" />
            Book & share
          </button>
        </section>
      </main>

      <BottomNav active="Explore" />
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className={`font-display text-headline-md ${highlight ? 'text-primary' : 'text-on-surface'}`}
      >
        {value}
      </span>
      <span className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-sm rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-xl text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name="groups" />
      </div>
      <p className="font-headline text-headline-md text-primary">Nothing matching</p>
      <p className="font-body text-body-md text-on-surface-variant">
        Try a different filter, or share your own booking to get the ball rolling.
      </p>
      <button
        onClick={onCreate}
        className="mt-xs inline-flex items-center gap-xs rounded-full bg-primary px-lg py-sm font-label text-label-lg text-on-primary transition active:scale-95"
      >
        <Icon name="add" />
        Share a booking
      </button>
    </div>
  );
}

function InviteCard({
  invite,
  currentUserId,
  tone,
  onJoin,
  onLeave,
  onCancel,
}: {
  invite: Invite;
  currentUserId: string;
  tone: string;
  onJoin: () => void;
  onLeave: () => void;
  onCancel: () => void;
}) {
  const { isHost, isJoined, isFull } = inviteStatus(invite, currentUserId);
  const filled = invite.joined.length;
  const total = invite.totalPlayers;
  const slotsLeft = Math.max(0, total - filled);
  const fillRatio = filled / total;

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-surface-container-lowest shadow-elevated ${
        isHost ? 'border-primary/40' : isFull ? 'border-outline-variant/40' : 'border-outline-variant/20'
      }`}
    >
      <div className="flex items-start gap-md p-md">
        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${tone}`}>
          <span className="font-display text-headline-md leading-none">{invite.hostInitials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-sm">
            <div className="min-w-0">
              <p className="truncate font-headline text-headline-md leading-tight text-primary">
                {isHost ? 'Hosted by you' : invite.hostName}
              </p>
              <p className="font-label text-label-sm text-on-surface-variant">
                {invite.courtName} · {invite.courtType}
              </p>
            </div>
            <span
              className={`flex-shrink-0 rounded-full px-2 py-0.5 font-label text-label-sm font-bold uppercase tracking-wider ${
                isFull
                  ? 'bg-error-container text-on-error-container'
                  : skillStyle[invite.skillLevel]
              }`}
            >
              {isFull ? 'Full' : invite.skillLevel}
            </span>
          </div>

          <div className="mt-sm grid grid-cols-2 gap-xs">
            <Field icon="calendar_today" value={invite.dateLabel} />
            <Field icon="schedule" value={`${invite.startTime} - ${invite.endTime}`} />
            <Field icon="timer" value={formatDuration(invite.durationMins)} />
            <Field icon="groups" value={`${filled} / ${total} players`} />
          </div>
        </div>
      </div>

      {invite.notes && (
        <p className="border-t border-outline-variant/30 px-md py-sm font-body text-body-md text-on-surface-variant">
          “{invite.notes}”
        </p>
      )}

      <div className="border-t border-outline-variant/30 px-md py-sm">
        <div className="mb-xs flex items-center justify-between">
          <span className="font-label text-label-sm text-on-surface-variant">
            {filled} joined
          </span>
          <span className="font-label text-label-sm text-on-surface-variant">
            {slotsLeft} open
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
          <div
            className={`h-full transition-all ${isFull ? 'bg-error' : 'bg-primary'}`}
            style={{ width: `${Math.min(100, fillRatio * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-sm border-t border-outline-variant/30 p-md">
        <button className="flex items-center gap-xs font-label text-label-lg text-primary transition active:scale-95">
          <Icon name="chat_bubble_outline" />
          Message
        </button>
        {isHost ? (
          <button
            onClick={onCancel}
            className="flex items-center gap-xs rounded-xl border border-error px-md py-sm font-label text-label-lg text-error transition active:scale-95"
          >
            <Icon name="delete_outline" />
            Cancel invite
          </button>
        ) : isJoined ? (
          <button
            onClick={onLeave}
            className="flex items-center gap-xs rounded-xl bg-secondary-container px-md py-sm font-label text-label-lg text-on-secondary-container transition active:scale-95"
          >
            <Icon name="check" />
            Joined · Leave
          </button>
        ) : isFull ? (
          <button
            disabled
            className="flex items-center gap-xs rounded-xl bg-surface-container px-md py-sm font-label text-label-lg text-outline"
          >
            <Icon name="lock" filled />
            Court is full
          </button>
        ) : (
          <button
            onClick={onJoin}
            className="flex items-center gap-xs rounded-xl bg-primary px-md py-sm font-label text-label-lg text-on-primary shadow-elevated transition active:scale-95"
          >
            <Icon name="login" />
            Join game
          </button>
        )}
      </div>
    </article>
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
