
import { useState } from 'react';
import { format } from 'date-fns';
import { MoreVertical, Edit, Trash, Clock, CalendarIcon, RotateCw } from 'lucide-react';
import { Task } from './AddTaskModal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    <div className={`rounded-lg p-4 mb-2 flex items-start gap-3 transition-all ${
      task.completed ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'
    }`}>
      <Checkbox 
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={(checked) => {
          onToggleComplete(task.id, checked === true);
        }}
        className="mt-1"
      />
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <label 
            htmlFor={`task-${task.id}`}
            className={`text-base font-medium transition-all ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.name}
          </label>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 mb-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={priorityBadgeVariants[task.priority]} variant="outline">
            <div className={`h-2 w-2 rounded-full ${priorityColors[task.priority]} mr-1.5`} />
            {priorityLabels[task.priority]}
          </Badge>
          
          <Badge variant="secondary" className="bg-muted">
            {task.category}
          </Badge>
          
          {task.timeAllocation && (
            <Badge variant="secondary" className="bg-muted flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.timeAllocation} min
            </Badge>
          )}
          
          {task.dueDate && (
            <Badge variant="secondary" className="bg-muted flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {format(task.dueDate, 'MMM d')}
            </Badge>
          )}
          
          {task.recurring !== 'none' && (
            <Badge variant="secondary" className="bg-muted flex items-center gap-1">
              <RotateCw className="h-3 w-3" />
              {task.recurring}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
