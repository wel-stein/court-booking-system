import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: { icon: string; label: string; onClick: () => void };
}

export function PageHeader({ title, subtitle, trailing }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="px-container-padding pt-xl">
      <div className="flex items-start justify-between gap-md">
        <div className="flex items-start gap-sm">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-elevated transition active:scale-95"
            aria-label="back"
          >
            <Icon name="arrow_back" />
          </button>
          <div>
            {subtitle && (
              <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                {subtitle}
              </p>
            )}
            <h1 className="font-display text-display-lg leading-tight text-primary">{title}</h1>
          </div>
        </div>
        {trailing && (
          <button
            onClick={trailing.onClick}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-elevated transition active:scale-95"
            aria-label={trailing.label}
          >
            <Icon name={trailing.icon} />
          </button>
        )}
      </div>
    </header>
  );
}
