import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import CalorieTracker from '@/components/physical/CalorieTracker';
import MacronutrientChart from '@/components/physical/MacronutrientChart';
import TaskList from '@/components/shared/TaskList';
import { Heart, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Physical = () => {
  // In a real app, this would come from a state management system or API
  const macros = {
    protein: 75,
    carbs: 200,
    fat: 55
  };

  const initialTasks = [
    {
      id: '1',
      name: 'Morning Workout',
      category: 'physical',
      description: '30 minutes cardio and strength training',
      timeAllocation: 30,
      priority: 'high',
      recurring: 'daily',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Evening Walk',
      category: 'physical',
      description: '20 minutes walk in the park',
      timeAllocation: 20,
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
            <div className="p-2 rounded-lg bg-physical/10 text-physical">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Physical Goals</h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Track your nutrition and physical health
          </motion.p>
        </div>
      </div>
      
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TaskList category="physical" initialTasks={initialTasks} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CalorieTracker />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <MacronutrientChart 
            protein={75} 
            carbs={200} 
            fat={55} 
          />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Physical;
