import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const items: NavItem[] = [
  { label: 'Explore', icon: 'map', path: '/' },
  { label: 'Bookings', icon: 'calendar_today', path: '/bookings' },
  { label: 'Rewards', icon: 'military_tech', path: '/rewards' },
  { label: 'Profile', icon: 'person', path: '/profile' },
];

interface BottomNavProps {
  active?: string;
}

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeLabel =
    active ?? items.find((i) => i.path === location.pathname)?.label ?? 'Explore';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-screen-sm items-center justify-around rounded-t-xl border-t border-outline-variant/30 bg-surface px-4 pb-6 pt-2 shadow-elevated-top">
      {items.map((item) => {
        const isActive = item.label === activeLabel;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center px-5 py-1 transition-all duration-200 active:scale-90 ${
              isActive
                ? 'rounded-full bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <Icon name={item.icon} filled={isActive} />
            <span className="font-label text-label-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
