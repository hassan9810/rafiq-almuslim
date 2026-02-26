import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { IslamicDivider } from './IslamicDivider';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** Replace icon with an emoji string */
  emoji?: string;
}

export function PageHeader({ icon: Icon, title, subtitle, emoji }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12 relative pt-10 pb-6"
    >
      {/* Subtle Islamic pattern background */}
      <div className="absolute inset-0 -mx-4 rounded-3xl islamic-pattern opacity-40 pointer-events-none" />

      <div className="relative px-4">
        {/* Icon container — animated glow halo + pulse ring */}
        <motion.div
          className="relative inline-flex items-center justify-center mb-6"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
        >
          {/* Outer breathing halo */}
          <div className="absolute -inset-3 rounded-3xl bg-accent/15 blur-lg animate-breathe-glow" />
          {/* Gold pulse ring */}
          <div className="absolute inset-0 rounded-2xl animate-gold-pulse" />
          {/* Icon box */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 ring-2 ring-accent/30 shadow-glow">
            {emoji ? (
              <span className="text-2xl">{emoji}</span>
            ) : (
              <Icon className="w-8 h-8 text-primary" />
            )}
          </div>
        </motion.div>

        {/* Title — extra line-height and vertical padding prevent Arabic diacritic clipping */}
        <h1
          className="font-arabic text-3xl md:text-4xl font-bold text-gradient-emerald"
          style={{ lineHeight: '1.6', paddingBlock: '0.2em', marginBottom: '0.5rem' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="font-arabic text-muted-foreground max-w-2xl mx-auto"
            style={{ lineHeight: '1.8', paddingBottom: '0.25rem' }}
          >
            {subtitle}
          </p>
        )}

        {/* Gold ornamental divider */}
        <IslamicDivider className="mt-6 mx-auto" />
      </div>
    </motion.div>
  );
}

export default PageHeader;
