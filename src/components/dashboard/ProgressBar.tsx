
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelClassName?: string;
}

const ProgressBar = ({
  value,
  max,
  color = 'bg-primary',
  showLabel = true,
  size = 'md',
  className,
  labelClassName,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(color, heightClasses[size], 'rounded-full')}
        />
      </div>
      
      {showLabel && (
        <div className={cn('flex justify-between mt-1 text-xs text-muted-foreground', labelClassName)}>
          <span>{value.toLocaleString()} / {max.toLocaleString()}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
