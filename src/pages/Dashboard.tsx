import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import DashboardCard from '@/components/dashboard/DashboardCard';
import QuoteDisplay from '@/components/dashboard/QuoteDisplay';
import ProgressBar from '@/components/dashboard/ProgressBar';
import SuccessTracker from '@/components/shared/SuccessTracker';
import { Heart, Brain, GraduationCap, Smile, Trophy, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [goalData] = useState({
    physical: { current: 1250, target: 2000, streak: 4 },
    mental: { current: 2, target: 4, streak: 6 },
    educational: { current: 90, target: 210, streak: 3 },
    fun: { current: 2, target: 3, streak: 5 }
  });

  const handlePrevMonth = () => {
    // Handle previous month navigation
    console.log('Navigate to previous month');
  };

  const handleNextMonth = () => {
    // Handle next month navigation
    console.log('Navigate to next month');
  };

  return (
    <PageTransition>
      <div className="relative mb-12">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl" />
          <div className="absolute -top-20 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-green-200/30 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
            >
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Welcome to Nourishly.
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="ml-14 space-y-1"
          >
            <p className="text-lg text-gray-600">
              Track your goals and balance your life with ease
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Physical Health</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Mental Wellness</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Personal Growth</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <QuoteDisplay />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Goal Progress
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-indigo-100 to-purple-100" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Physical Goals"
            icon={<Heart className="w-5 h-5 text-physical" />}
            color="bg-physical"
            to="/physical"
            progress={(goalData.physical.current / goalData.physical.target) * 100}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Daily Calorie Intake</p>
                <ProgressBar 
                  value={goalData.physical.current} 
                  max={goalData.physical.target} 
                  color="bg-physical"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-physical" />
                  <span className="font-medium">{goalData.physical.streak} days</span>
                </span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Mental Goals"
            icon={<Brain className="w-5 h-5 text-mental" />}
            color="bg-mental"
            to="/mental"
            progress={(goalData.mental.current / goalData.mental.target) * 100}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Daily Tasks Completed</p>
                <ProgressBar 
                  value={goalData.mental.current} 
                  max={goalData.mental.target} 
                  color="bg-mental"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-mental" />
                  <span className="font-medium">{goalData.mental.streak} days</span>
                </span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Educational Goals"
            icon={<GraduationCap className="w-5 h-5 text-educational" />}
            color="bg-educational"
            to="/educational"
            progress={(goalData.educational.current / goalData.educational.target) * 100}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Study Time (minutes)</p>
                <ProgressBar 
                  value={goalData.educational.current} 
                  max={goalData.educational.target} 
                  color="bg-educational"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-educational" />
                  <span className="font-medium">{goalData.educational.streak} days</span>
                </span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Fun Activities"
            icon={<Smile className="w-5 h-5 text-fun" />}
            color="bg-fun"
            to="/fun"
            progress={(goalData.fun.current / goalData.fun.target) * 100}
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Activities Completed</p>
                <ProgressBar 
                  value={goalData.fun.current} 
                  max={goalData.fun.target} 
                  color="bg-fun"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Streak</span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-fun" />
                  <span className="font-medium">{goalData.fun.streak} days</span>
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <SuccessTracker
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;
