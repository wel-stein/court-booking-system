import { Icon } from './Icon';
import type { TimeBand } from '../data/courts';

interface TimeSlotsProps {
  bands: TimeBand[];
  selected: string;
  blocked: Set<string>;
  onSelect: (time: string) => void;
}

export function TimeSlots({ bands, selected, blocked, onSelect }: TimeSlotsProps) {
  return (
    <section className="space-y-md">
      <div className="flex items-baseline justify-between">
        <h3 className="font-headline text-headline-md text-primary">Start Time</h3>
        <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
          30-min steps
        </span>
      </div>

      <div className="space-y-md">
        {bands.map((band) => {
          const containsSelected = band.slots.includes(selected);
          const open = band.slots.filter((s) => !blocked.has(s)).length;
          return (
            <div
              key={band.id}
              className={`rounded-xl border bg-surface-container-lowest p-md shadow-elevated transition-colors ${
                containsSelected ? 'border-primary/40' : 'border-outline-variant/30'
              }`}
            >
              <header className="mb-sm flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      containsSelected
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    <Icon name={band.icon} filled={containsSelected} />
                  </span>
                  <div>
                    <p className="font-headline text-label-lg leading-tight text-primary">
                      {band.label}
                    </p>
                    <p className="font-label text-label-sm text-on-surface-variant">
                      {band.hint}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-secondary-fixed px-2 py-0.5 font-label text-label-sm font-bold text-on-secondary-fixed">
                  {open} open
                </span>
              </header>

              <div className="grid grid-cols-4 gap-sm">
                {band.slots.map((time) => {
                  const isBlocked = blocked.has(time);
                  const isActive = time === selected;
                  if (isBlocked) {
                    return (
                      <button
                        key={time}
                        disabled
                        aria-label={`${time} unavailable`}
                        className="cursor-not-allowed rounded-md border border-outline-variant/30 bg-surface-container px-xs py-xs font-label text-label-lg line-through opacity-40"
                      >
                        {time}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={time}
                      onClick={() => onSelect(time)}
                      aria-pressed={isActive}
                      className={`rounded-md px-xs py-xs font-label text-label-lg transition-all active:scale-95 ${
                        isActive
                          ? 'border-2 border-primary bg-primary text-on-primary shadow-elevated'
                          : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
