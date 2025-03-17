
import { useMemo } from 'react';
import { FoodItem } from './AddFoodItemModal';
import GoalCard from '../goals/GoalCard';
import ProgressBar from '../dashboard/ProgressBar';
import { LineChart, ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface NutritionSummaryProps {
  foodItems: FoodItem[];
}

const NutritionSummary = ({ foodItems }: NutritionSummaryProps) => {
  const nutritionTotals = useMemo(() => {
    return foodItems.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories * item.quantity,
          protein: acc.protein + item.protein * item.quantity,
          carbs: acc.carbs + item.carbs * item.quantity,
          fat: acc.fat + item.fat * item.quantity,
          fiber: acc.fiber + item.fiber * item.quantity,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [foodItems]);

  // Default daily goals (could be user-configurable in the future)
  const dailyGoals = {
    calories: 2000,
    protein: 50,
    carbs: 225,
    fat: 70,
    fiber: 30,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GoalCard
        title="Calorie Summary"
        icon={<LineChart className="h-5 w-5 text-physical" />}
        color="text-physical"
      >
        <div className="space-y-6">
          <div>
            <ProgressBar
              value={nutritionTotals.calories}
              max={dailyGoals.calories}
              color="bg-physical"
              size="lg"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Consumed</p>
              <p className="text-lg font-semibold">{Math.round(nutritionTotals.calories)} cal</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-lg font-semibold">
                {Math.max(0, Math.round(dailyGoals.calories - nutritionTotals.calories))} cal
              </p>
            </div>
          </motion.div>
        </div>
      </GoalCard>
      
      <GoalCard
        title="Macronutrient Targets"
        icon={<ActivitySquare className="h-5 w-5 text-physical" />}
        color="text-physical"
      >
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Protein ({Math.round(nutritionTotals.protein)}g)</span>
              <span className="text-sm text-muted-foreground">{dailyGoals.protein}g</span>
            </div>
            <ProgressBar
              value={nutritionTotals.protein}
              max={dailyGoals.protein}
              color="bg-blue-500"
              showLabel={false}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Carbs ({Math.round(nutritionTotals.carbs)}g)</span>
              <span className="text-sm text-muted-foreground">{dailyGoals.carbs}g</span>
            </div>
            <ProgressBar
              value={nutritionTotals.carbs}
              max={dailyGoals.carbs}
              color="bg-purple-500"
              showLabel={false}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Fat ({Math.round(nutritionTotals.fat)}g)</span>
              <span className="text-sm text-muted-foreground">{dailyGoals.fat}g</span>
            </div>
            <ProgressBar
              value={nutritionTotals.fat}
              max={dailyGoals.fat}
              color="bg-pink-500"
              showLabel={false}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Fiber ({Math.round(nutritionTotals.fiber)}g)</span>
              <span className="text-sm text-muted-foreground">{dailyGoals.fiber}g</span>
            </div>
            <ProgressBar
              value={nutritionTotals.fiber}
              max={dailyGoals.fiber}
              color="bg-green-500"
              showLabel={false}
            />
          </div>
        </div>
      </GoalCard>
    </div>
  );
};

export default NutritionSummary;
