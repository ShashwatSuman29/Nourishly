import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';
import { Clock, Flag, CalendarIcon, RotateCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'mental' | 'educational' | 'fun';
export type RecurringOption = 'daily' | 'weekly' | 'monthly' | 'none';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Task name must be at least 3 characters.",
  }),
  category: z.enum(['mental', 'educational', 'fun']),
  description: z.string().optional(),
  timeAllocation: z.number().min(0).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  recurring: z.enum(['none', 'daily', 'weekly', 'monthly']),
});

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Task) => void;
  editingTask: Task | null;
}

const AddTaskModal = ({
  open,
  onOpenChange,
  onAddTask,
  editingTask,
}: AddTaskModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingTask
      ? {
          name: editingTask.name,
          category: editingTask.category,
          description: editingTask.description || '',
          timeAllocation: editingTask.timeAllocation || 0,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate,
          recurring: editingTask.recurring,
        }
      : {
          name: '',
          category: 'mental',
          description: '',
          timeAllocation: 30,
          priority: 'medium',
          recurring: 'none',
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const task: Task = {
      id: editingTask?.id || crypto.randomUUID(),
      name: values.name,
      category: values.category,
      description: values.description,
      timeAllocation: values.timeAllocation,
      priority: values.priority,
      dueDate: values.dueDate,
      recurring: values.recurring,
      completed: editingTask?.completed || false,
      createdAt: editingTask?.createdAt || new Date(),
    };
    
    onAddTask(task);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {editingTask ? 'update your' : 'create a new'} task.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Read 5 pages of a book" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mental">Mental</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="fun">Fun</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add notes about your task"
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeAllocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Allocation (minutes)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          min={0}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                            Low
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                            High
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurring option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
