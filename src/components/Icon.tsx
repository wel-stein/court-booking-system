interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className = '', filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 500" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}
