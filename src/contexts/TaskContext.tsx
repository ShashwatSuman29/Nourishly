import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface Task {
  id: string;
  name: string;
  description?: string;
  category: 'mental' | 'physical' | 'educational' | 'fun';
  priority: 'low' | 'medium' | 'high';
  timeAllocation?: number;
  dueDate?: Date;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string, completed: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load tasks when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedTasks: Task[] = data.map(task => ({
          id: task.id,
          name: task.name,
          description: task.description,
          category: task.category,
          priority: task.priority,
          timeAllocation: task.time_allocation,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          recurring: task.recurring,
          completed: task.completed,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at)
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();

    // Subscribe to changes
    const tasksSubscription = supabase
      .channel('tasks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadTasks(); // Reload tasks when changes occur
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          name: taskData.name,
          description: taskData.description,
          category: taskData.category,
          priority: taskData.priority,
          time_allocation: taskData.timeAllocation,
          due_date: taskData.dueDate?.toISOString(),
          recurring: taskData.recurring,
          completed: taskData.completed
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        priority: data.priority,
        timeAllocation: data.time_allocation,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        recurring: data.recurring,
        completed: data.completed,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setTasks(current => [newTask, ...current]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          priority: updates.priority,
          time_allocation: updates.timeAllocation,
          due_date: updates.dueDate?.toISOString(),
          recurring: updates.recurring,
          completed: updates.completed
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(current =>
        current.map(task =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(current => current.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
} 