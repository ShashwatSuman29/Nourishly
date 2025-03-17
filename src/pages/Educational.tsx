import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import EducationalGoals from '@/components/educational/EducationalGoals';
import GoalCard from '@/components/goals/GoalCard';
import TaskList from '@/components/shared/TaskList';
import { GraduationCap, ChevronLeft, BookOpen, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Educational = () => {
  const initialTasks = [
    {
      id: '1',
      name: 'Study React Hooks',
      category: 'educational',
      description: 'Learn about useEffect and custom hooks',
      timeAllocation: 60,
      priority: 'high',
      recurring: 'daily',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Read Tech Articles',
      category: 'educational',
      description: 'Stay updated with latest tech trends',
      timeAllocation: 30,
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
            <div className="p-2 rounded-lg bg-educational/10 text-educational">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Educational Goals</h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Track your learning and skill development
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
          <TaskList category="educational" initialTasks={initialTasks} />
          <EducationalGoals />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <GoalCard
            title="Learning Resources"
            icon={<BookOpen className="w-5 h-5" />}
            color="text-educational"
          >
            <ul className="space-y-3 py-2">
              {[
                "Algorithms & Data Structures",
                "React.js Advanced Patterns",
                "System Design Fundamentals",
                "JavaScript Performance",
              ].map((resource, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <div className="p-1.5 rounded-md bg-educational/10 text-educational">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">{resource}</span>
                </motion.li>
              ))}
            </ul>
          </GoalCard>
          
          <GoalCard
            title="Monthly Progress"
            icon={<BarChart className="w-5 h-5" />}
            color="text-educational"
          >
            <div className="h-52 flex items-end justify-between gap-1 pt-4">
              {['W1', 'W2', 'W3', 'W4'].map((week, i) => (
                <div key={week} className="flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: [120, 180, 80, 60][i] }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-12 bg-educational rounded-t-lg"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">{week}</div>
                </div>
              ))}
            </div>
          </GoalCard>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Educational;
