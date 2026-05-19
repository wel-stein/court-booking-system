import type { DateOption } from '../data/courts';

interface DateStripProps {
  dates: DateOption[];
  selectedIso: string;
  onSelect: (iso: string) => void;
}

export function DateStrip({ dates, selectedIso, onSelect }: DateStripProps) {
  const selected = dates.find((d) => d.iso === selectedIso) ?? dates[0];
  return (
    <section>
      <div className="mb-sm flex items-center justify-between">
        <h3 className="font-headline text-headline-md text-primary">Select Date</h3>
        <span className="font-label text-label-lg text-primary">{selected.monthLabel}</span>
      </div>
      <div className="hide-scrollbar flex gap-sm overflow-x-auto pb-xs">
        {dates.map((d) => {
          const isActive = d.iso === selectedIso;
          return (
            <button
              key={d.iso}
              onClick={() => onSelect(d.iso)}
              className={`flex h-20 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'border-2 border-primary bg-primary text-on-primary shadow-elevated'
                  : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
              }`}
            >
              <span className="text-label-sm uppercase opacity-80">{d.day}</span>
              <span className="font-headline text-headline-md">{d.date}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
