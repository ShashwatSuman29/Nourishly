
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  to: string;
  children: ReactNode;
  progress?: number;
  className?: string;
}

const DashboardCard = ({
  title,
  icon,
  color,
  to,
  children,
  progress = 0,
  className,
}: DashboardCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl bg-white shadow-sm border border-border overflow-hidden',
        className
      )}
    >
      <div className="relative">
        {progress > 0 && (
          <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
            <motion.div 
              className={`h-full ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                {icon}
              </div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
            </div>
            
            <Link 
              to={to}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="text-foreground/80">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
