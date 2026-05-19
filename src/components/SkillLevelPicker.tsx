import type { SkillLevel } from '../state/InvitesContext';
import { Icon } from './Icon';

const OPTIONS: { value: SkillLevel; hint: string }[] = [
  { value: 'Open', hint: 'All levels welcome' },
  { value: 'Beginner', hint: 'New to the sport — patient, learning together' },
  { value: 'Intermediate', hint: 'Knows the basics, recreational pace' },
  { value: 'Advanced', hint: 'Competitive rallies, fast play' },
  { value: 'Pro', hint: 'Tournament level — bring your A game' },
];

interface SkillLevelPickerProps {
  value: SkillLevel;
  onChange: (v: SkillLevel) => void;
}

export function SkillLevelPicker({ value, onChange }: SkillLevelPickerProps) {
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];
  return (
    <div>
      <div className="mb-sm flex items-center justify-between">
        <p className="font-label text-label-lg text-primary">Game level</p>
        <span className="font-label text-label-sm text-on-surface-variant">Helps set expectations</span>
      </div>
      <div className="-mx-md">
        <div className="hide-scrollbar flex gap-sm overflow-x-auto px-md pb-xs">
          {OPTIONS.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                aria-pressed={active}
                className={`flex-shrink-0 rounded-full px-md py-xs font-label text-label-lg transition active:scale-95 ${
                  active
                    ? 'bg-primary text-on-primary shadow-elevated'
                    : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                }`}
              >
                {opt.value === 'Open' ? 'Open for all' : opt.value}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-xs flex items-center gap-xs font-label text-label-sm text-on-surface-variant">
        <Icon name="info" className="text-base text-primary" />
        {current.hint}
      </p>
    </div>
  );
}
