import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddTaskModal from '../mental/AddTaskModal';
import TaskItem from '../mental/TaskItem';
import { useTask } from '@/contexts/TaskContext';
import type { Task } from '@/contexts/TaskContext';

interface TaskListProps {
  category: Task['category'];
}

const TaskList = ({ category }: TaskListProps) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTaskComplete } = useTask();

  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addTask(task);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await toggleTaskComplete(id, completed);
  };

  const completedTasks = tasks.filter(task => task.completed && task.category === category);
  const incompleteTasks = tasks.filter(task => !task.completed && task.category === category);

  const categoryTitles = {
    mental: 'Mental Wellness Tasks',
    physical: 'Physical Wellness Tasks',
    educational: 'Educational Tasks',
    fun: 'Fun Activities'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white border rounded-xl p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Task Manager</h2>
        <Button onClick={() => {
          setEditingTask(null);
          setIsAddTaskModalOpen(true);
        }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Category Tasks */}
      <div>
        <h3 className="text-lg font-medium mb-2">{categoryTitles[category]}</h3>
        <div className="space-y-1">
          {incompleteTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm py-2">No {category} tasks. Add some!</p>
          ) : (
            <AnimatePresence mode="popLayout">
              {incompleteTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskItem
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskItem
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AddTaskModal
        open={isAddTaskModalOpen}
        onOpenChange={setIsAddTaskModalOpen}
        onAddTask={handleAddTask}
        editingTask={editingTask}
        defaultCategory={category}
      />
    </div>
  );
};

export default TaskList; 