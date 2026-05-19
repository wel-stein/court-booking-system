import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/TopAppBar';
import { ProgressBar } from '../components/ProgressBar';
import { BottomNav } from '../components/BottomNav';
import { Icon } from '../components/Icon';
import { useBooking } from '../state/BookingContext';
import { addMinutes, courts, type Court } from '../data/courts';

const statusBarColor: Record<Court['status'], string> = {
  available: 'bg-primary-container',
  booked: 'bg-error',
  maintenance: 'bg-outline',
};

const statusLabelColor: Record<Court['status'], string> = {
  available: 'text-primary-container',
  booked: 'text-error',
  maintenance: 'text-outline',
};

function CourtCard({
  court,
  selected,
  onSelect,
}: {
  court: Court;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  const baseFrame =
    'relative aspect-[3/4] rounded-xl overflow-hidden transition-all';
  if (court.status === 'maintenance') {
    return (
      <div
        className={`${baseFrame} court-pattern border border-outline-variant bg-surface-container`}
      >
        <div className={`absolute left-0 top-0 h-1.5 w-full ${statusBarColor[court.status]}`} />
        <div className="flex h-full flex-col justify-between p-md">
          <div>
            <span className={`font-label text-label-lg uppercase tracking-wider ${statusLabelColor[court.status]}`}>
              {court.name}
            </span>
            <p className="mt-xs font-headline text-headline-md text-on-surface-variant">{court.type}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-label text-label-sm text-outline">{court.amenities}</span>
            <Icon name="build" className="text-outline" />
          </div>
        </div>
      </div>
    );
  }
  if (court.status === 'booked') {
    return (
      <div className={`${baseFrame} bg-surface-container-low opacity-60 shadow-sm`}>
        <div className={`absolute left-0 top-0 h-1.5 w-full ${statusBarColor[court.status]}`} />
        <div className="flex h-full flex-col justify-between p-md">
          <div>
            <span className={`font-label text-label-lg uppercase tracking-wider ${statusLabelColor[court.status]}`}>
              {court.name}
            </span>
            <p className="mt-xs font-headline text-headline-md text-on-surface-variant">{court.type}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-label text-label-sm text-outline">{court.amenities}</span>
            <Icon name="lock" filled className="text-error" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(court.id)}
      className={`${baseFrame} group cursor-pointer border-2 bg-surface-container-lowest shadow-elevated active:scale-[0.98] ${
        selected ? 'border-primary' : 'border-transparent'
      }`}
    >
      <div className={`absolute left-0 top-0 h-1.5 w-full ${statusBarColor[court.status]}`} />
      <div className="flex h-full flex-col justify-between p-md text-left">
        <div>
          <span className={`font-label text-label-lg uppercase tracking-wider ${statusLabelColor[court.status]}`}>
            {court.name}
          </span>
          <p className="mt-xs font-headline text-headline-md text-on-surface">{court.type}</p>
        </div>
        <div className="flex items-end justify-between">
          <span className="font-label text-label-sm text-outline">{court.amenities}</span>
          <Icon
            name="check_circle"
            filled
            className={`text-primary transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>
      {selected && <div className="active-court-glow pointer-events-none absolute inset-0 rounded-xl" />}
    </button>
  );
}

export function SelectCourt() {
  const navigate = useNavigate();
  const { selectedDate, startTime, durationMins, selectedCourtId, selectCourt } = useBooking();
  const endTime = addMinutes(startTime, durationMins);
  const dateLabel = selectedDate
    ? `${selectedDate.day}, ${selectedDate.date} ${selectedDate.monthLabel.split(' ')[0].slice(0, 3)}`
    : '';

  return (
    <div className="min-h-dvh bg-background pb-32 text-on-background">
      <TopAppBar title="Select Court" />
      <ProgressBar step={2} />
      <div className="fixed left-0 right-0 top-[68px] z-30 mx-auto max-w-screen-sm bg-primary-container px-container-padding py-3 text-on-primary-container shadow-elevated">
        <div className="flex items-center gap-sm">
          <Icon name="calendar_today" className="text-xl" />
          <p className="font-label text-label-lg">
            {dateLabel} | {startTime} - {endTime} ({durationMins} Mins)
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-screen-sm px-container-padding pt-32">
        <section className="mb-lg">
          <div className="mb-md flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-on-surface">Available Courts</h2>
            <button className="flex items-center gap-xs font-label text-label-lg text-primary">
              <Icon name="filter_list" className="text-lg" />
              Filter
            </button>
          </div>
        </section>

        <section className="mb-lg flex items-center justify-between px-xs">
          <div className="flex items-center gap-xs">
            <div className="h-3 w-3 rounded-full bg-primary-container" />
            <span className="font-label text-label-sm text-on-surface-variant">Available</span>
          </div>
          <div className="flex items-center gap-xs">
            <div className="h-3 w-3 rounded-full bg-error" />
            <span className="font-label text-label-sm text-on-surface-variant">Booked</span>
          </div>
          <div className="flex items-center gap-xs">
            <div className="h-3 w-3 rounded-full bg-outline" />
            <span className="font-label text-label-sm text-on-surface-variant">Maintenance</span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-gutter">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              selected={selectedCourtId === court.id}
              onSelect={(id) => selectCourt(id === selectedCourtId ? null : id)}
            />
          ))}
        </div>

        <section className="mb-base mt-xl">
          <div className="relative h-48 w-full overflow-hidden rounded-xl">
            <img
              alt="Olympic Arena Hub"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?auto=format&fit=crop&w=900&q=70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
            <div className="absolute bottom-md left-md">
              <p className="font-headline text-headline-md text-on-primary">Olympic Arena Hub</p>
              <p className="font-label text-label-sm text-on-primary/80">Downtown Center, Building A</p>
            </div>
          </div>
        </section>
      </main>

      <div
        className={`fixed bottom-24 right-container-padding z-40 mx-auto max-w-screen-sm transition-all duration-300 ${
          selectedCourtId ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-32 opacity-0'
        }`}
      >
        <button
          onClick={() => navigate('/summary')}
          className="flex items-center gap-sm rounded-full border border-on-secondary-container/10 bg-secondary-container px-lg py-md font-headline text-headline-md text-on-secondary-container shadow-lg active:scale-90"
        >
          <span>Proceed</span>
          <Icon name="arrow_forward" />
        </button>
      </div>

      <BottomNav active="Bookings" />
    </div>
  );
}
