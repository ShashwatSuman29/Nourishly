export type TaskCategory = 'mental' | 'physical' | 'educational' | 'fun';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurringOption = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  name: string;
  description?: string;
  timeAllocation?: number;
  priority: TaskPriority;
  dueDate?: Date;
  recurring: RecurringOption;
  completed: boolean;
  category: TaskCategory;
  createdAt: Date;
} 