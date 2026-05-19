import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

type NotificationCategory = 'booking' | 'promo' | 'match' | 'system';

interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  cta?: { label: string; href: string };
}

const seed: AppNotification[] = [
  {
    id: 'n1',
    category: 'booking',
    title: 'Court 04 is confirmed',
    body: 'Your session on Mon, 23 Oct at 09:00 is locked in. Tap to view your pass.',
    time: '2m ago',
    unread: true,
    cta: { label: 'View receipt', href: '/bookings' },
  },
  {
    id: 'n2',
    category: 'match',
    title: 'New partner match',
    body: 'Jordan L. is looking for a doubles partner this Friday at Olympic Arena.',
    time: '1h ago',
    unread: true,
    cta: { label: 'Find Partner', href: '/bookings' },
  },
  {
    id: 'n3',
    category: 'promo',
    title: '20% off Pro Shop',
    body: 'Yonex rackets are on sale through Sunday. Stock up before the weekend.',
    time: '3h ago',
    unread: true,
    cta: { label: 'Shop now', href: '/shop' },
  },
  {
    id: 'n4',
    category: 'booking',
    title: 'Reminder: Court 01 tomorrow',
    body: '07:30 - 08:30 at Olympic Arena. Bring your AcePoint membership card.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'n5',
    category: 'system',
    title: 'New app version available',
    body: 'AcePoint v1.0.0 is ready with court filtering improvements.',
    time: '2d ago',
    unread: false,
  },
];

const filters: { key: 'all' | 'unread' | NotificationCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'booking', label: 'Bookings' },
  { key: 'match', label: 'Matches' },
  { key: 'promo', label: 'Offers' },
];

const categoryStyle: Record<NotificationCategory, { icon: string; iconClass: string }> = {
  booking: {
    icon: 'event_available',
    iconClass: 'bg-secondary-container text-on-secondary-container',
  },
  match: {
    icon: 'sports_tennis',
    iconClass: 'bg-primary-container text-on-primary-container',
  },
  promo: {
    icon: 'local_offer',
    iconClass: 'bg-tertiary-container text-on-tertiary-container',
  },
  system: {
    icon: 'info',
    iconClass: 'bg-surface-container-highest text-on-surface-variant',
  },
};

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(seed);
  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all');

  const visible = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));

  const handleSelect = (n: AppNotification) => {
    setNotifications((list) => list.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    if (n.cta) navigate(n.cta.href);
  };

  const clearOne = (id: string) =>
    setNotifications((list) => list.filter((n) => n.id !== id));

  return (
    <div className="min-h-dvh bg-surface pb-28 text-on-surface">
      <PageHeader
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        title="Inbox"
        trailing={
          unreadCount > 0
            ? { icon: 'done_all', label: 'mark all read', onClick: markAllRead }
            : undefined
        }
      />

      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-lg">
        <section className="-mx-container-padding">
          <div className="hide-scrollbar flex gap-sm overflow-x-auto px-container-padding">
            {filters.map((f) => {
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

        <p className="-mt-sm flex items-center gap-xs font-label text-label-sm text-on-surface-variant">
          <Icon name="swipe_left" className="text-base text-primary" />
          Swipe an item left to delete
        </p>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-sm rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-xl text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon name="notifications_off" />
            </div>
            <p className="font-headline text-headline-md text-primary">Nothing here yet</p>
            <p className="font-body text-body-md text-on-surface-variant">
              You're all caught up for this filter.
            </p>
          </div>
        ) : (
          <ul className="space-y-sm">
            {visible.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onSelect={handleSelect}
                onDismiss={clearOne}
              />
            ))}
          </ul>
        )}
      </main>

      <BottomNav active="Explore" />
    </div>
  );
}

const SWIPE_DELETE_THRESHOLD = 96;
const SWIPE_MAX = 200;

function NotificationItem({
  notification: n,
  onSelect,
  onDismiss,
}: {
  notification: AppNotification;
  onSelect: (n: AppNotification) => void;
  onDismiss: (id: string) => void;
}) {
  const style = categoryStyle[n.category];
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    moved.current = false;
    setAnimating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.touches[0].clientX - startX.current;
    if (Math.abs(delta) > 6) moved.current = true;
    // Only allow left swipe; resist a little past the threshold
    const clamped = Math.max(-SWIPE_MAX, Math.min(0, delta));
    setDragX(clamped);
  };

  const handleTouchEnd = () => {
    if (startX.current == null) return;
    setAnimating(true);
    if (dragX <= -SWIPE_DELETE_THRESHOLD) {
      setDragX(-window.innerWidth);
      setTimeout(() => onDismiss(n.id), 200);
    } else {
      setDragX(0);
    }
    startX.current = null;
  };

  const handleCardClick = () => {
    if (moved.current || Math.abs(dragX) > 4) return;
    onSelect(n);
  };

  const intensity = Math.min(1, Math.abs(dragX) / SWIPE_DELETE_THRESHOLD);

  return (
    <li
      className={`relative overflow-hidden rounded-xl border bg-error transition-shadow ${
        n.unread ? 'border-primary/30' : 'border-outline-variant/20'
      }`}
    >
      {/* Delete action layer */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-end gap-sm pr-lg text-on-error"
        style={{ opacity: intensity }}
        aria-hidden
      >
        <Icon name="delete" filled />
        <span className="font-label text-label-lg font-bold uppercase tracking-wider">
          Release to delete
        </span>
      </div>

      {/* Foreground card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: animating ? 'transform 200ms ease-out' : 'none',
        }}
        className="relative bg-surface-container-lowest"
      >
        {n.unread && (
          <span className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden />
        )}
        <button
          onClick={handleCardClick}
          className="flex w-full items-start gap-md p-md pr-14 text-left active:bg-surface-container-low/40"
        >
          <span
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${style.iconClass}`}
          >
            <Icon name={style.icon} filled={n.unread} />
          </span>
          <div className="flex-1 space-y-xs">
            <div className="flex items-center justify-between gap-sm">
              <p
                className={`font-headline text-headline-md leading-tight ${
                  n.unread ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {n.title}
              </p>
              <span className="flex-shrink-0 font-label text-label-sm text-outline">
                {n.time}
              </span>
            </div>
            <p className="font-body text-body-md text-on-surface-variant">{n.body}</p>
            {n.cta && (
              <span className="inline-flex items-center gap-xs pt-xs font-label text-label-lg text-primary">
                {n.cta.label}
                <Icon name="arrow_forward" className="text-base" />
              </span>
            )}
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(n.id);
          }}
          aria-label="dismiss notification"
          className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full text-outline transition hover:bg-surface-container active:scale-90"
        >
          <Icon name="close" />
        </button>
      </div>
    </li>
  );
}
