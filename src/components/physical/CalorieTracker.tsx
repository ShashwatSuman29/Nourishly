
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import ProgressBar from '../dashboard/ProgressBar';
import AddFoodItemModal, { FoodItem } from './AddFoodItemModal';
import FoodItemsList from './FoodItemsList';
import NutritionSummary from './NutritionSummary';
import FoodImageUpload from './FoodImageUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const foodItems = [
  { id: '1', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, quantity: 1, category: 'Snack' },
  { id: '2', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, quantity: 1, category: 'Lunch' },
  { id: '3', name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, quantity: 1, category: 'Lunch' },
  { id: '4', name: 'Avocado (1/2)', calories: 161, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, quantity: 1, category: 'Breakfast' },
  { id: '5', name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4, fiber: 0, quantity: 1, category: 'Breakfast' },
  { id: '6', name: 'Salmon (3 oz)', calories: 177, protein: 19, carbs: 0, fat: 11, fiber: 0, quantity: 1, category: 'Dinner' },
  { id: '7', name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.8, quantity: 1, category: 'Dinner' },
  { id: '8', name: 'Egg', calories: 72, protein: 6, carbs: 0.6, fat: 5, fiber: 0, quantity: 1, category: 'Breakfast' }
];

const CalorieTracker = () => {
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  
  const handleAddFoodItem = (food: FoodItem) => {
    if (editingFood) {
      setSelectedFoods(selectedFoods.map(item => 
        item.id === editingFood.id ? food : item
      ));
      setEditingFood(null);
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };
  
  const handleDeleteFood = (id: string) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== id));
  };
  
  const handleEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setIsAddFoodModalOpen(true);
  };
  
  const handleAddFood = (food: FoodItem) => {
    const existingFoodIndex = selectedFoods.findIndex(
      selectedFood => selectedFood.id === food.id
    );

    if (existingFoodIndex >= 0) {
      const updatedFoods = [...selectedFoods];
      updatedFoods[existingFoodIndex].quantity += 1;
      setSelectedFoods(updatedFoods);
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
    }
  };

  const handleRemoveFood = (foodId: string) => {
    const existingFoodIndex = selectedFoods.findIndex(
      selectedFood => selectedFood.id === foodId
    );

    if (existingFoodIndex >= 0) {
      const updatedFoods = [...selectedFoods];
      if (updatedFoods[existingFoodIndex].quantity > 1) {
        updatedFoods[existingFoodIndex].quantity -= 1;
        setSelectedFoods(updatedFoods);
      } else {
        setSelectedFoods(selectedFoods.filter(food => food.id !== foodId));
      }
    }
  };

  const handleFoodRecognized = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: crypto.randomUUID(),
    };
    setSelectedFoods([...selectedFoods, newFood]);
  };

  return (
    <div className="space-y-6">
      {/* Nutrition Summary */}
      <NutritionSummary foodItems={selectedFoods} />
      
      {/* Add Food Tabs */}
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="image">Image Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4 mt-4">
          {/* Add Food Button */}
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                setEditingFood(null);
                setIsAddFoodModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Food Item
            </Button>
          </div>
          
          {/* Quick Add Section */}
          <div className="bg-muted/50 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-4">Quick Add Common Foods</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {foodItems.map((food) => (
                <motion.button
                  key={food.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddFood(food)}
                  className="flex flex-col items-start p-3 bg-white rounded-lg text-left shadow-sm hover:shadow transition-all"
                >
                  <span className="font-medium">{food.name}</span>
                  <span className="text-sm text-muted-foreground">{food.calories} calories</span>
                </motion.button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4 mt-4">
          <FoodImageUpload onFoodRecognized={handleFoodRecognized} />
        </TabsContent>
      </Tabs>
      
      {/* Food Items List */}
      <FoodItemsList 
        foodItems={selectedFoods} 
        onDeleteFood={handleDeleteFood}
        onEditFood={handleEditFood}
      />
      
      {/* Add Food Modal */}
      <AddFoodItemModal
        open={isAddFoodModalOpen}
        onOpenChange={setIsAddFoodModalOpen}
        onAddFood={handleAddFoodItem}
      />
    </div>
  );
};

export default CalorieTracker;
