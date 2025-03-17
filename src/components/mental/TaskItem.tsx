import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { MoreVertical, Edit, Clock, CalendarIcon, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) => {
  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };
  
  const priorityLabels = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
  };
  
  const priorityBadgeVariants = {
    low: 'bg-green-100 text-green-800 hover:bg-green-100',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    high: 'bg-red-100 text-red-800 hover:bg-red-100',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        task.completed ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.name}
          </h3>
          <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
        </div>
        {task.description && (
          <p className={`text-sm text-gray-500 mt-1 ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
