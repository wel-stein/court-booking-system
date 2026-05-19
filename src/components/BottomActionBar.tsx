import type { ReactNode } from 'react';

interface BottomActionBarProps {
  caption?: string;
  primaryText: ReactNode;
  children?: ReactNode;
}

export function BottomActionBar({ caption, primaryText, children }: BottomActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-screen-sm rounded-t-xl border-t border-outline-variant/10 bg-surface p-md shadow-elevated-top">
      <div className="mx-auto flex max-w-screen-md items-center gap-md">
        <div className="flex-1">
          {caption && <p className="text-label-sm text-outline">{caption}</p>}
          <p className="font-headline text-headline-md leading-tight text-primary">{primaryText}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
