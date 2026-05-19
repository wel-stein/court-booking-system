import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

interface TopAppBarProps {
  title: string;
  leadingIcon?: string;
  trailingIcon?: string;
  onLeading?: () => void;
  onTrailing?: () => void;
}

export function TopAppBar({
  title,
  leadingIcon = 'arrow_back',
  trailingIcon = 'account_circle',
  onLeading,
  onTrailing,
}: TopAppBarProps) {
  const navigate = useNavigate();
  const handleLeading = onLeading ?? (() => navigate(-1));
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto h-16 max-w-screen-sm bg-surface px-container-padding shadow-sm">
      <div className="flex h-full items-center justify-between">
        <button
          onClick={handleLeading}
          className="text-primary transition-transform duration-150 active:scale-95"
          aria-label="back"
        >
          <Icon name={leadingIcon} />
        </button>
        <h1 className="font-headline text-headline-md font-semibold text-primary">{title}</h1>
        <button
          onClick={onTrailing}
          className="text-primary transition-transform duration-150 active:scale-95"
          aria-label="account"
        >
          <Icon name={trailingIcon} />
        </button>
      </div>
    </header>
  );
}
