interface TimeSlotsProps {
  slots: string[];
  selected: string;
  blocked: Set<string>;
  onSelect: (time: string) => void;
}

export function TimeSlots({ slots, selected, blocked, onSelect }: TimeSlotsProps) {
  return (
    <section className="space-y-sm">
      <h3 className="font-headline text-headline-md text-primary">Start Time</h3>
      <div className="grid grid-cols-4 gap-sm">
        {slots.map((time) => {
          const isBlocked = blocked.has(time);
          const isActive = time === selected;
          if (isBlocked) {
            return (
              <button
                key={time}
                disabled
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
              className={`rounded-md px-xs py-xs font-label text-label-lg transition-all active:scale-95 ${
                isActive
                  ? 'border-2 border-primary bg-primary text-on-primary'
                  : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </section>
  );
}
