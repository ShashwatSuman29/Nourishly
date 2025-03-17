
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, FileCode, Users, Play, Pause, RotateCcw } from 'lucide-react';
import ProgressBar from '../dashboard/ProgressBar';

interface Goal {
  id: string;
  title: string;
  target: number; // in minutes
  current: number; // in minutes
  icon: JSX.Element;
  color: string;
}

const EducationalGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'DSA Practice',
      target: 60, // 1 hour
      current: 0,
      icon: <Code className="w-5 h-5" />,
      color: 'text-educational'
    },
    {
      id: '2',
      title: 'Development Work',
      target: 120, // 2 hours
      current: 0,
      icon: <FileCode className="w-5 h-5" />,
      color: 'text-educational'
    },
    {
      id: '3',
      title: 'Networking',
      target: 30, // 30 minutes
      current: 0,
      icon: <Users className="w-5 h-5" />,
      color: 'text-educational'
    }
  ]);
  
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (timerRunning && activeTimer) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
        
        if (seconds && seconds % 60 === 0) {
          setGoals(prevGoals => 
            prevGoals.map(goal => 
              goal.id === activeTimer 
                ? { ...goal, current: goal.current + 1 } 
                : goal
            )
          );
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, activeTimer, seconds]);
  
  const startTimer = (goalId: string) => {
    if (activeTimer === goalId && timerRunning) {
      // Pause the current timer
      setTimerRunning(false);
    } else if (activeTimer === goalId && !timerRunning) {
      // Resume the current timer
      setTimerRunning(true);
    } else {
      // Start a new timer
      setActiveTimer(goalId);
      setTimerRunning(true);
      setSeconds(0);
    }
  };
  
  const resetTimer = (goalId: string) => {
    if (activeTimer === goalId) {
      setTimerRunning(false);
      setActiveTimer(null);
      setSeconds(0);
    }
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {goals.map(goal => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-educational/10 ${goal.color}`}>
              {goal.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">
                Target: {goal.target} minutes per day
              </p>
            </div>
          </div>
          
          <ProgressBar
            value={goal.current}
            max={goal.target}
            color="bg-educational"
            className="mb-4"
          />
          
          <div className="flex items-center justify-between mt-4">
            <div>
              {activeTimer === goal.id && (
                <div className="text-xl font-mono font-medium">
                  {formatTime(seconds)}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => startTimer(goal.id)}
                className={`p-2 rounded-full 
                  ${activeTimer === goal.id && timerRunning
                    ? 'bg-educational/10 text-educational'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
              >
                {activeTimer === goal.id && timerRunning ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              
              {activeTimer === goal.id && (
                <button
                  onClick={() => resetTimer(goal.id)}
                  className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EducationalGoals;
