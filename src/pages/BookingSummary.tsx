import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/TopAppBar';
import { ProgressBar } from '../components/ProgressBar';
import { PriceCard } from '../components/PriceCard';
import { BottomActionBar } from '../components/BottomActionBar';
import { Icon } from '../components/Icon';
import { priceFor, useBooking } from '../state/BookingContext';
import { addMinutes, courts } from '../data/courts';

export function BookingSummary() {
  const navigate = useNavigate();
  const { selectedCourtId, selectedDate, startTime, durationMins } = useBooking();

  useEffect(() => {
    if (!selectedCourtId) navigate('/courts', { replace: true });
  }, [selectedCourtId, navigate]);

  const court = courts.find((c) => c.id === selectedCourtId);
  const endTime = addMinutes(startTime, durationMins);
  const total = priceFor(court, durationMins);

  return (
    <div className="min-h-dvh bg-surface pb-36 text-on-surface">
      <TopAppBar title="Booking Summary" />
      <ProgressBar step={3} />
      <main className="mx-auto max-w-screen-sm space-y-md px-container-padding pt-20">
        <div className="group relative mb-lg aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg">
          <img
            alt="Court"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <div className="absolute bottom-md left-md">
            <span className="mb-xs inline-block rounded-full bg-secondary-container px-2 py-1 font-label text-label-sm text-on-secondary-container">
              {court?.type.toUpperCase() ?? 'PREMIUM COURT'}
            </span>
            <h2 className="font-headline text-headline-md text-white">
              {court?.name} - {court?.type}
            </h2>
          </div>
        </div>

        <section className="mb-lg space-y-md">
          <h3 className="font-headline text-headline-md text-primary">Booking Details</h3>
          <div className="grid grid-cols-1 gap-base rounded-xl border border-outline-variant/20 bg-surface-container p-md shadow-sm">
            <DetailRow label="Court" value={`${court?.name} - ${court?.type}`} />
            <DetailRow label="Date" value={selectedDate?.fullLabel ?? ''} />
            <DetailRow label="Time" value={`${startTime} - ${endTime}`} />
            <DetailRow label="Duration" value={`${durationMins} Mins`} last />
          </div>
        </section>

        <PriceCard
          title="Pricing Breakdown"
          subtitle="Total"
          total={total}
          caption={`Base Rate: $${(court?.ratePer30Min ?? 12).toFixed(2)} / 30 mins`}
          footnotes={[
            { icon: 'info', label: 'Includes court rental & amenities' },
            { icon: 'bolt', label: 'Instant confirmation active' },
          ]}
        />
      </main>

      <BottomActionBar caption="Selected Window" primaryText={`${startTime} - ${endTime}`}>
        <button
          onClick={() => navigate('/receipt')}
          className="flex items-center gap-sm rounded-xl bg-secondary-fixed px-xl py-md font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition-all hover:bg-secondary-fixed-dim active:scale-95"
        >
          <span>Confirm &amp; Pay</span>
          <Icon name="arrow_forward" />
        </button>
      </BottomActionBar>
    </div>
  );
}

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-xs ${
        last ? '' : 'border-b border-outline-variant/30'
      }`}
    >
      <span className="font-label text-label-lg text-on-surface-variant">{label}</span>
      <span className="font-bold text-primary">{value}</span>
    </div>
  );
}
