import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import TaskList from '@/components/shared/TaskList';
import GoalCard from '@/components/goals/GoalCard';
import { Brain, ChevronLeft, Timer, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mental = () => {
  const initialTasks = [
    {
      id: '1',
      name: 'Meditate for 10 minutes',
      category: 'mental',
      description: 'Use the Headspace app',
      timeAllocation: 10,
      priority: 'high',
      recurring: 'daily',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Journal your thoughts',
      category: 'mental',
      description: 'Write about what you feel grateful for today',
      timeAllocation: 15,
      priority: 'medium',
      recurring: 'daily',
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
            <div className="p-2 rounded-lg bg-mental/10 text-mental">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Mental Goals</h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Take care of your mental wellness
          </motion.p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <TaskList category="mental" initialTasks={initialTasks} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <GoalCard
            title="Meditation Timer"
            icon={<Timer className="w-5 h-5" />}
            color="text-mental"
          >
            <div className="text-center py-6">
              <div className="text-4xl font-mono mb-4">05:00</div>
              <button className="px-4 py-2 bg-mental text-white rounded-lg font-medium hover:bg-mental/90 transition-colors">
                Start Session
              </button>
            </div>
          </GoalCard>
          
          <GoalCard
            title="Weekly Progress"
            icon={<BarChart className="w-5 h-5" />}
            color="text-mental"
          >
            <div className="space-y-4 py-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} className="flex items-center gap-2">
                  <div className="w-10 text-sm text-muted-foreground">{day}</div>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${[75, 50, 100, 25, 0][i]}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="h-full bg-mental"
                    />
                  </div>
                  <div className="w-8 text-sm text-right">
                    {[3, 2, 4, 1, 0][i]}/4
                  </div>
                </div>
              ))}
            </div>
          </GoalCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Mental;
