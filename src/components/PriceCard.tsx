import { Icon } from './Icon';

interface PriceCardProps {
  title: string;
  total: number;
  subtitle?: string;
  caption: string;
  footnotes?: { icon: string; label: string }[];
}

export function PriceCard({ title, total, subtitle = 'Subtotal', caption, footnotes }: PriceCardProps) {
  return (
    <section className="mt-xl">
      <div className="flex flex-col items-start justify-between gap-md rounded-xl bg-primary p-lg text-on-primary md:flex-row md:items-center">
        <div className="space-y-xs">
          <p className="text-label-sm uppercase tracking-widest opacity-80">{title}</p>
          <div className="flex items-baseline gap-xs">
            <span className="font-display text-display-lg">${total.toFixed(2)}</span>
            <span className="font-label text-label-lg opacity-80">{subtitle}</span>
          </div>
          <p className="text-label-sm italic text-on-primary-container">{caption}</p>
        </div>
        {footnotes && footnotes.length > 0 && (
          <>
            <div className="hidden h-16 w-px bg-on-primary-container/30 md:block" />
            <div className="space-y-xs">
              {footnotes.map((f) => (
                <div key={f.label} className="flex items-center gap-sm">
                  <Icon name={f.icon} className="text-secondary-fixed" />
                  <span className="font-label text-label-lg">{f.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
