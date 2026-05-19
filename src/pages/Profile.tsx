import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';

interface StatProps {
  label: string;
  value: string;
  hint?: string;
}

const stats: StatProps[] = [
  { label: 'Matches', value: '42', hint: 'this season' },
  { label: 'Win rate', value: '68%', hint: '+4% vs last' },
  { label: 'Hours', value: '76', hint: 'on court' },
];

interface MenuItem {
  icon: string;
  label: string;
  hint?: string;
  trailing?: string;
}

const accountItems: MenuItem[] = [
  { icon: 'badge', label: 'Personal information', hint: 'Name, contact, address' },
  { icon: 'payments', label: 'Payment methods', hint: '2 cards saved' },
  { icon: 'card_membership', label: 'Membership', hint: 'AcePoint Pro · expires Dec' },
  { icon: 'history', label: 'Booking history', hint: 'View past sessions' },
];

const preferenceItems: MenuItem[] = [
  { icon: 'sports_tennis', label: 'Playing style', hint: 'Doubles · Intermediate' },
  { icon: 'language', label: 'Language', trailing: 'English' },
  { icon: 'public', label: 'Region', trailing: 'United States' },
];

const supportItems: MenuItem[] = [
  { icon: 'help', label: 'Help center' },
  { icon: 'gavel', label: 'Terms & privacy' },
  { icon: 'logout', label: 'Sign out' },
];

export function Profile() {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="min-h-dvh bg-surface pb-28 text-on-surface">
      <section className="relative overflow-hidden bg-primary px-container-padding pb-12 pt-10 text-on-primary">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-container opacity-50" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-on-primary/10" />

        <div className="relative z-10 flex items-start justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-on-primary/10 text-on-primary transition active:scale-95"
            aria-label="back"
          >
            <Icon name="arrow_back" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-on-primary/10 text-on-primary transition active:scale-95"
            aria-label="settings"
          >
            <Icon name="settings" />
          </button>
        </div>

        <div className="relative z-10 mt-xl flex items-center gap-lg">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-on-primary/20 bg-secondary-fixed text-on-secondary-fixed">
              <span className="font-display text-display-lg leading-none">AS</span>
            </div>
            <button
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-elevated"
              aria-label="edit avatar"
            >
              <Icon name="photo_camera" />
            </button>
          </div>
          <div className="flex-1 space-y-xs">
            <p className="font-label text-label-sm uppercase tracking-widest opacity-80">
              AcePoint Pro Member
            </p>
            <h1 className="font-display text-display-lg leading-tight">Alex Smith</h1>
            <p className="font-body text-body-md text-on-primary-container">
              alex.smith@example.com
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-md max-w-screen-sm space-y-lg px-container-padding">
        <section className="grid grid-cols-3 gap-gutter rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-md pb-md pt-xl shadow-elevated">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="font-display text-headline-md text-primary">{s.value}</span>
              <span className="font-label text-label-sm uppercase tracking-wider text-on-surface-variant">
                {s.label}
              </span>
              {s.hint && (
                <span className="font-label text-label-sm text-outline">{s.hint}</span>
              )}
            </div>
          ))}
        </section>

        <MenuSection
          title="Account"
          items={accountItems}
          onSelect={(label) => {
            if (label === 'Booking history') navigate('/bookings');
          }}
        />

        <section>
          <h3 className="mb-sm font-headline text-headline-md text-primary">Notifications</h3>
          <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-elevated">
            <Toggle
              icon="notifications"
              label="Push notifications"
              hint="Booking reminders & confirmations"
              value={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
            <Toggle
              icon="sports_score"
              label="Match alerts"
              hint="Score updates & tournament news"
              value={matchAlerts}
              onChange={setMatchAlerts}
              divider
            />
            <Toggle
              icon="campaign"
              label="Promotions"
              hint="Offers & seasonal deals"
              value={marketing}
              onChange={setMarketing}
              divider
            />
          </div>
        </section>

        <MenuSection title="Preferences" items={preferenceItems} />
        <MenuSection
          title="Support"
          items={supportItems}
          onSelect={(label) => {
            if (label === 'Sign out') navigate('/');
          }}
        />

        <p className="pb-md text-center font-label text-label-sm text-outline">
          AcePoint · v1.0.0
        </p>
      </main>

      <BottomNav active="Profile" />
    </div>
  );
}

function MenuSection({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: MenuItem[];
  onSelect?: (label: string) => void;
}) {
  return (
    <section>
      <h3 className="mb-sm font-headline text-headline-md text-primary">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-elevated">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => onSelect?.(item.label)}
            className={`flex w-full items-center gap-md px-md py-md text-left transition active:bg-surface-container ${
              i > 0 ? 'border-t border-outline-variant/30' : ''
            }`}
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon name={item.icon} />
            </span>
            <div className="flex-1">
              <p className="font-label text-label-lg text-primary">{item.label}</p>
              {item.hint && (
                <p className="font-label text-label-sm text-on-surface-variant">{item.hint}</p>
              )}
            </div>
            {item.trailing ? (
              <span className="font-label text-label-sm text-on-surface-variant">
                {item.trailing}
              </span>
            ) : (
              <Icon name="chevron_right" className="text-outline" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function Toggle({
  icon,
  label,
  hint,
  value,
  onChange,
  divider = false,
}: {
  icon: string;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-md px-md py-md ${
        divider ? 'border-t border-outline-variant/30' : ''
      }`}
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name={icon} />
      </span>
      <div className="flex-1">
        <p className="font-label text-label-lg text-primary">{label}</p>
        {hint && <p className="font-label text-label-sm text-on-surface-variant">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 rounded-full transition-colors ${
          value ? 'bg-primary' : 'bg-outline-variant'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-7 w-7 rounded-full bg-white shadow-md transition-transform ${
            value ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
