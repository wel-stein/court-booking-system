import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { BottomNav } from '../components/BottomNav';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-surface pb-28 text-on-surface">
      <header className="px-container-padding pt-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
              Smash &amp; Volley
            </p>
            <h1 className="font-display text-display-lg text-primary">AcePoint</h1>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-elevated transition active:scale-95"
            aria-label="notifications"
          >
            <Icon name="notifications" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-tertiary-container" />
          </button>
        </div>
        <p className="mt-sm font-body text-body-md text-on-surface-variant">
          Welcome back. Ready for your next match?
        </p>
      </header>

      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-lg">
        <section className="relative overflow-hidden rounded-xl bg-primary p-lg text-on-primary shadow-elevated">
          <div className="relative z-10 max-w-[70%] space-y-xs">
            <p className="font-label text-label-sm uppercase tracking-widest opacity-80">
              Today's Highlight
            </p>
            <h2 className="font-headline text-headline-md">Olympic Arena Hub</h2>
            <p className="font-body text-body-md text-on-primary-container">
              6 courts available · From $12 / 30 mins
            </p>
            <button
              onClick={() => navigate('/book')}
              className="mt-md inline-flex items-center gap-xs rounded-full bg-secondary-fixed px-lg py-sm font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition active:scale-95"
            >
              Book a Court
              <Icon name="arrow_forward" />
            </button>
          </div>
          <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-primary-container opacity-50" />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-on-primary/10" />
        </section>

        <section>
          <div className="mb-sm flex items-center justify-between">
            <h3 className="font-headline text-headline-md text-primary">Quick actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-gutter">
            <QuickAction icon="calendar_today" label="My Bookings" onClick={() => navigate('/bookings')} />
            <QuickAction icon="groups" label="Find Partner" onClick={() => navigate('/bookings')} />
            <QuickAction icon="military_tech" label="Tournaments" onClick={() => navigate('/bookings')} />
            <QuickAction icon="store" label="Pro Shop" onClick={() => navigate('/shop')} />
          </div>
        </section>

        <section>
          <div className="mb-sm flex items-center justify-between">
            <h3 className="font-headline text-headline-md text-primary">Upcoming session</h3>
            <button
              onClick={() => navigate('/bookings')}
              className="font-label text-label-lg text-primary"
            >
              View all
            </button>
          </div>
          <div className="rounded-xl bg-surface-container-lowest p-md shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                  No bookings yet
                </p>
                <p className="mt-xs font-headline text-headline-md text-primary">Start your week strong</p>
              </div>
              <button
                onClick={() => navigate('/book')}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-elevated transition active:scale-95"
                aria-label="book"
              >
                <Icon name="add" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <BottomNav active="Explore" />
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-sm rounded-xl bg-surface-container-lowest p-md text-left shadow-elevated transition active:scale-[0.98]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name={icon} />
      </span>
      <span className="font-label text-label-lg text-primary">{label}</span>
    </button>
  );
}
