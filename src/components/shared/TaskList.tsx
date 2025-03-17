import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddTaskModal from '../mental/AddTaskModal';
import TaskItem from '../mental/TaskItem';
import { Task, TaskCategory } from '@/types/task';

interface TaskListProps {
  category: TaskCategory;
  initialTasks?: Task[];
}

const TaskList = ({ category, initialTasks = [] }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...task, category }]);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  const getTasksByCategory = () => {
    return incompleteTasks.filter(task => task.category === category);
  };

  const categoryTitles = {
    mental: 'Mental Wellness Tasks',
    physical: 'Physical Wellness Tasks',
    educational: 'Educational Tasks',
    fun: 'Fun Activities'
  };

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
          {getTasksByCategory().length === 0 ? (
            <p className="text-muted-foreground text-sm py-2">No {category} tasks. Add some!</p>
          ) : (
            getTasksByCategory().map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
          <div className="space-y-1">
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
          </div>
        </div>
      )}

      <AddTaskModal
        open={isAddTaskModalOpen}
        onOpenChange={setIsAddTaskModalOpen}
        onAddTask={handleAddTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default TaskList; 