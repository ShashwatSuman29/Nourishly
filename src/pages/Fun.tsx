import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import ActivitySuggestion from '@/components/fun/ActivitySuggestion';
import GoalCard from '@/components/goals/GoalCard';
import TaskList from '@/components/shared/TaskList';
import { Smile, ChevronLeft, Trophy, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Fun = () => {
  const initialTasks = [
    {
      id: '1',
      name: 'Play Guitar',
      category: 'fun',
      description: 'Practice your favorite song',
      timeAllocation: 30,
      priority: 'medium',
      recurring: 'daily',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Video Games',
      category: 'fun',
      description: 'Enjoy some gaming time',
      timeAllocation: 60,
      priority: 'low',
      recurring: 'none',
      completed: false,
      createdAt: new Date(),
    }
  ];

  return (
    <PageTransition>
      <div className="mb-8 flex items-center">
        <Link 
          to="/"
          className="mr-4 p-2 rounded-full hover:bg-muted/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-fun/10 text-fun">
              <Smile className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Fun Activities</h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Make time for enjoyment and relaxation
          </motion.p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <TaskList category="fun" initialTasks={initialTasks} />
          <ActivitySuggestion />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <GoalCard
            title="Activity Streaks"
            icon={<Trophy className="w-5 h-5" />}
            color="text-fun"
          >
            <div className="space-y-3 py-3">
              {[
                { name: "Music", streak: 8 },
                { name: "Games", streak: 5 },
                { name: "Reading", streak: 3 },
                { name: "Creative", streak: 2 }
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <span className="text-sm font-medium">{activity.name}</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-fun" />
                    <span className="text-sm">{activity.streak} days</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GoalCard>
          
          <GoalCard
            title="Activity Calendar"
            icon={<Calendar className="w-5 h-5" />}
            color="text-fun"
          >
            <div className="grid grid-cols-7 gap-1 pt-3">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: day * 0.01 }}
                  className={`h-8 w-8 flex items-center justify-center rounded-full text-xs
                    ${[2, 3, 7, 10, 12, 15, 20, 21, 25, 27].includes(day)
                      ? 'bg-fun text-white'
                      : 'bg-muted/50 text-muted-foreground'
                    }`}
                >
                  {day}
                </motion.div>
              ))}
            </div>
          </GoalCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Fun;
