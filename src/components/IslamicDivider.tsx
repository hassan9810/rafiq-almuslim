import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IslamicDividerProps {
  className?: string;
  variant?: 'gold' | 'primary' | 'muted';
  width?: number;
}

/**
 * Arabesque ornamental line divider using SVG.
 * Animates in from the center outward on first render / scroll into view.
 */
export function IslamicDivider({ className, variant = 'gold', width = 200 }: IslamicDividerProps) {
  const colorMap = {
    gold: 'text-accent',
    primary: 'text-primary',
    muted: 'text-muted-foreground/40',
  };

  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        width={width}
        height="16"
        viewBox="0 0 200 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={colorMap[variant]}
        aria-hidden="true"
      >
        {/* Left line */}
        <line x1="10" y1="8" x2="70" y2="8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        {/* Left small diamond */}
        <path d="M70 8L76 4L82 8L76 12Z" fill="currentColor" fillOpacity="0.5" />
        {/* Center line left */}
        <line x1="82" y1="8" x2="90" y2="8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        {/* Center large diamond */}
        <path d="M90 8L100 2L110 8L100 14Z" fill="currentColor" fillOpacity="0.8" />
        {/* Inner diamond highlight */}
        <path d="M95 8L100 5L105 8L100 11Z" fill="currentColor" fillOpacity="0.3" />
        {/* Center line right */}
        <line x1="110" y1="8" x2="118" y2="8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
        {/* Right small diamond */}
        <path d="M118 8L124 4L130 8L124 12Z" fill="currentColor" fillOpacity="0.5" />
        {/* Right line */}
        <line x1="130" y1="8" x2="190" y2="8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        {/* Endpoint dots */}
        <circle cx="10" cy="8" r="2" fill="currentColor" fillOpacity="0.3" />
        <circle cx="190" cy="8" r="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    </motion.div>
  );
}
