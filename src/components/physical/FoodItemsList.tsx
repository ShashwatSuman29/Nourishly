
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FoodItem } from './AddFoodItemModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GoalCard from '../goals/GoalCard';
import { Utensils } from 'lucide-react';

interface FoodItemsListProps {
  foodItems: FoodItem[];
  onDeleteFood: (id: string) => void;
  onEditFood: (food: FoodItem) => void;
}

const FoodItemsList = ({ foodItems, onDeleteFood, onEditFood }: FoodItemsListProps) => {
  if (foodItems.length === 0) {
    return null;
  }

  // Group food items by category
  const groupedFoodItems = foodItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const categories = Object.keys(groupedFoodItems);

  return (
    <GoalCard 
      title="Today's Food Log" 
      icon={<Utensils className="h-5 w-5 text-physical" />}
      color="text-physical"
      className="mt-6"
    >
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="px-3 py-1">
                {category}
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="text-right">Protein</TableHead>
                    <TableHead className="text-right">Carbs</TableHead>
                    <TableHead className="text-right">Fat</TableHead>
                    <TableHead className="text-right">Fiber</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedFoodItems[category].map((food) => (
                    <motion.tr
                      key={food.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b last:border-b-0"
                    >
                      <TableCell className="font-medium">{food.name}</TableCell>
                      <TableCell className="text-right">{food.calories * food.quantity}</TableCell>
                      <TableCell className="text-right">{(food.protein * food.quantity).toFixed(1)}g</TableCell>
                      <TableCell className="text-right">{(food.carbs * food.quantity).toFixed(1)}g</TableCell>
                      <TableCell className="text-right">{(food.fat * food.quantity).toFixed(1)}g</TableCell>
                      <TableCell className="text-right">{(food.fiber * food.quantity).toFixed(1)}g</TableCell>
                      <TableCell className="text-right">{food.quantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEditFood(food)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onDeleteFood(food.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </GoalCard>
  );
};

export default FoodItemsList;
