
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
  className?: string;
  colSpan?: string;
}

const GoalCard = ({
  title,
  description,
  icon,
  color,
  children,
  className,
  colSpan = 'col-span-1',
}: GoalCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl bg-white shadow-sm border border-border overflow-hidden',
        colSpan,
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        <div>{children}</div>
      </div>
    </motion.div>
  );
};

export default GoalCard;
