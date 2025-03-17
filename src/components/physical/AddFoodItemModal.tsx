
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  quantity: number;
  category: string;
}

interface AddFoodItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFood: (food: FoodItem) => void;
}

const mealCategories = ["Breakfast", "Lunch", "Dinner", "Snack"];

const AddFoodItemModal = ({ open, onOpenChange, onAddFood }: AddFoodItemModalProps) => {
  const [formData, setFormData] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    quantity: 1,
    category: 'Breakfast',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' ? value : Number(value),
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFood({
      ...formData,
      id: crypto.randomUUID(),
    });
    setFormData({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      quantity: 1,
      category: 'Breakfast',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Food Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Grilled Chicken Breast"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              name="calories"
              type="number"
              min="0"
              placeholder="e.g., 165"
              value={formData.calories}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 31"
                value={formData.protein}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 0"
                value={formData.carbs}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 3.5"
                value={formData.fat}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                name="fiber"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 0"
                value={formData.fiber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0.25"
                step="0.25"
                placeholder="e.g., 1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {mealCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Food Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodItemModal;
