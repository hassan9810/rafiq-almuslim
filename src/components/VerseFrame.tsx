import { cn } from '@/lib/utils';

interface VerseFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Show ornamental brackets ﴿ ﴾ around the content */
  showBrackets?: boolean;
  /** Parchment-style background */
  parchment?: boolean;
}

/**
 * Decorative frame for displaying Quranic verses, hadiths, and adhkar.
 * Features ornamental gold corner accents, optional ﴿﴾ brackets, and parchment background.
 */
export function VerseFrame({ children, className, showBrackets, parchment = true }: VerseFrameProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border p-6 md:p-8 overflow-hidden',
        parchment
          ? 'bg-gradient-to-b from-[hsl(45_40%_98%)] to-[hsl(45_30%_96%)] border-accent/20 dark:from-[hsl(30_15%_12%)] dark:to-[hsl(30_12%_10%)] dark:border-accent/15'
          : 'bg-card border-border/50',
        className
      )}
    >
      {/* Gold corner ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* Content */}
      <div className="relative z-10">
        {showBrackets ? (
          <div className="flex items-start gap-2">
            <span className="text-accent/60 text-3xl font-arabic leading-none mt-1 select-none" aria-hidden>﴿</span>
            <div className="flex-1">{children}</div>
            <span className="text-accent/60 text-3xl font-arabic leading-none mt-1 select-none" aria-hidden>﴾</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function CornerOrnament({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 -scale-x-100',
    'bottom-left': 'bottom-0 left-0 -scale-y-100',
    'bottom-right': 'bottom-0 right-0 -scale-x-100 -scale-y-100',
  };

  return (
    <svg
      className={cn('absolute w-8 h-8 text-accent/30 dark:text-accent/20', positionClasses[position])}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0 0L8 0L8 2L2 2L2 8L0 8Z" fill="currentColor" />
      <path d="M4 0L4 4L0 4" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
    </svg>
  );
}
