export type TaskCategory = 'mental' | 'physical' | 'educational' | 'fun';

export interface Task {
  id: string;
  name: string;
  description?: string;
  timeAllocation?: number;
  priority: TaskPriority;
  dueDate?: Date;
  recurring: RecurringOption;
  completed: boolean;
  createdAt: Date;
  category: TaskCategory;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurringOption = 'none' | 'daily' | 'weekly' | 'monthly'; 