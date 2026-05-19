import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/TopAppBar';
import { ProgressBar } from '../components/ProgressBar';
import { DateStrip } from '../components/DateStrip';
import { TimeSlots } from '../components/TimeSlots';
import { DurationPicker } from '../components/DurationPicker';
import { PriceCard } from '../components/PriceCard';
import { BottomActionBar } from '../components/BottomActionBar';
import { Icon } from '../components/Icon';
import { useBooking } from '../state/BookingContext';
import { addMinutes, blockedSlots, courts, timeSlots } from '../data/courts';

export function ChooseTime() {
  const navigate = useNavigate();
  const {
    dates,
    selectedDateIso,
    setSelectedDate,
    startTime,
    setStartTime,
    durationMins,
    setDuration,
  } = useBooking();

  const endTime = addMinutes(startTime, durationMins);
  const cheapestRate = Math.min(
    ...courts.filter((c) => c.status === 'available').map((c) => c.ratePer30Min),
  );
  const total = (durationMins / 30) * cheapestRate;

  return (
    <div className="min-h-dvh bg-surface pb-36 text-on-surface">
      <TopAppBar
        title="Book a Court"
        leadingIcon="close"
        trailingIcon="help_outline"
        onLeading={() => navigate('/')}
      />
      <ProgressBar step={1} />
      <main className="mx-auto max-w-screen-sm space-y-lg px-container-padding pt-24">
        <section>
          <h2 className="font-display text-display-lg text-primary">Choose your slot</h2>
          <p className="text-on-surface-variant">
            Select a date and time to see available courts at AcePoint.
          </p>
        </section>
        <DateStrip dates={dates} selectedIso={selectedDateIso} onSelect={setSelectedDate} />
        <TimeSlots
          slots={timeSlots}
          selected={startTime}
          blocked={blockedSlots}
          onSelect={setStartTime}
        />
        <DurationPicker value={durationMins} onChange={setDuration} />
        <PriceCard
          title="Estimated Pricing"
          subtitle="From"
          total={total}
          caption={`Starting from $${cheapestRate.toFixed(2)} / 30 mins`}
          footnotes={[
            { icon: 'info', label: 'Final price depends on court type' },
            { icon: 'bolt', label: 'Instant confirmation on selection' },
          ]}
        />
      </main>
      <BottomActionBar caption="Selected Window" primaryText={`${startTime} - ${endTime}`}>
        <button
          onClick={() => navigate('/courts')}
          className="flex items-center gap-sm rounded-xl bg-secondary-fixed px-xl py-md font-label text-label-lg font-bold text-on-secondary-fixed shadow-elevated transition-all hover:bg-secondary-fixed-dim active:scale-95"
        >
          <span>Check Courts</span>
          <Icon name="arrow_forward" />
        </button>
      </BottomActionBar>
    </div>
  );
}
