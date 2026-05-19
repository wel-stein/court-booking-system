import { Icon } from './Icon';

interface DurationPickerProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}

export function DurationPicker({
  value,
  min = 30,
  max = 240,
  step = 30,
  onChange,
}: DurationPickerProps) {
  const adjust = (delta: number) => {
    const next = value + delta;
    if (next >= min && next <= max) onChange(next);
  };

  return (
    <section className="space-y-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-headline-md text-primary">Duration</h3>
        <span className="rounded-full bg-secondary-fixed px-3 py-1 font-label text-label-lg font-bold text-on-secondary-fixed">
          {value} MINS
        </span>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-surface-container p-lg shadow-inner">
        <button
          onClick={() => adjust(-step)}
          disabled={value <= min}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-white text-primary shadow-elevated transition-transform active:scale-90 disabled:opacity-40"
          aria-label="decrease duration"
        >
          <Icon name="remove" />
        </button>
        <div className="flex-1 px-lg">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-md bg-outline-variant accent-primary"
          />
        </div>
        <button
          onClick={() => adjust(step)}
          disabled={value >= max}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-white text-primary shadow-elevated transition-transform active:scale-90 disabled:opacity-40"
          aria-label="increase duration"
        >
          <Icon name="add" />
        </button>
      </div>
    </section>
  );
}
