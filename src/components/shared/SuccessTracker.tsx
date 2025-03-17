import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';

interface SuccessTrackerProps {
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const SuccessTracker = ({ onPrevMonth, onNextMonth }: SuccessTrackerProps) => {
  const [currentMonth] = useState('March 2025');

  // Enhanced color palette with gradients
  const categoryColors = {
    mental: {
      base: '#7C3AED',
      gradient: 'from-[#7C3AED] to-[#9F67FF]',
      light: 'bg-purple-500/10'
    },
    physical: {
      base: '#EC4899',
      gradient: 'from-[#EC4899] to-[#F472B6]',
      light: 'bg-pink-500/10'
    },
    educational: {
      base: '#3B82F6',
      gradient: 'from-[#3B82F6] to-[#60A5FA]',
      light: 'bg-blue-500/10'
    },
    fun: {
      base: '#10B981',
      gradient: 'from-[#10B981] to-[#34D399]',
      light: 'bg-green-500/10'
    }
  };

  const categorySuccessDays = {
    mental: [2, 4, 6, 10, 15, 18, 19],
    physical: [1, 3, 5, 7, 8, 11, 12, 13, 14],
    educational: [2, 3, 7, 10, 12, 15, 20],
    fun: [1, 4, 6, 8, 15, 18, 19],
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get today's date for highlighting
  const today = new Date().getDate();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 rounded-xl p-4 shadow-lg max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10">
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Success Tracker
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
          <button
            onClick={onPrevMonth}
            className="p-1 rounded-md hover:bg-gray-700/50 transition-colors text-gray-400"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-medium px-2 text-gray-300">{currentMonth}</span>
          <button
            onClick={onNextMonth}
            className="p-1 rounded-md hover:bg-gray-700/50 transition-colors text-gray-400"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {days.map(day => {
          const successCategories = Object.entries(categorySuccessDays)
            .filter(([_, days]) => days.includes(day))
            .map(([category]) => category);

          const isToday = day === today;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: day * 0.01 }}
              className="relative aspect-square"
            >
              <div className={`
                h-full w-full flex items-center justify-center rounded-md text-xs
                transition-all duration-200 hover:scale-105 cursor-pointer group
                ${isToday ? 'ring-1 ring-indigo-500/50 ring-offset-1 ring-offset-gray-900' : ''}
                ${successCategories.length > 0 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm' 
                  : 'bg-gray-800/30 hover:bg-gray-700/30'
                }
              `}>
                <span className={`
                  font-medium
                  ${isToday ? 'text-indigo-400' : successCategories.length > 0 ? 'text-gray-300' : 'text-gray-600'}
                `}>
                  {day}
                </span>
                {successCategories.length > 0 && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-80 group-hover:opacity-100">
                    {successCategories.map(category => (
                      <motion.div
                        key={category}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`w-1 h-1 rounded-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors].gradient} shadow-sm shadow-black/20`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-gray-700/50">
        {Object.entries(categoryColors).map(([category, colors]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 group cursor-pointer"
          >
            <div className={`
              w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient}
              group-hover:scale-125 transition-transform duration-200 shadow-sm shadow-black/20
            `} />
            <span className="text-xs text-gray-400 capitalize group-hover:text-gray-200">
              {category}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuccessTracker; 