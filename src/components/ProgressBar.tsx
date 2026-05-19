interface ProgressBarProps {
  step: 1 | 2 | 3 | 4;
}

export function ProgressBar({ step }: ProgressBarProps) {
  const widths = { 1: 'w-1/4', 2: 'w-2/4', 3: 'w-3/4', 4: 'w-full' } as const;
  return (
    <div className="fixed left-0 right-0 top-16 z-40 mx-auto h-1 max-w-screen-sm bg-surface-container-highest">
      <div
        className={`progress-glow h-full bg-accent-lime transition-all duration-500 ${widths[step]}`}
      />
    </div>
  );
}
