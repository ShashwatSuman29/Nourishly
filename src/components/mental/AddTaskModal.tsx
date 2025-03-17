import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/contexts/TaskContext';

const formSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  category: z.enum(['mental', 'physical', 'educational', 'fun']),
  priority: z.enum(['low', 'medium', 'high']),
  timeAllocation: z.string()
    .min(1, 'Time allocation is required')
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: 'Time allocation must be a valid number'
    }),
  dueDate: z.date().optional(),
  recurring: z.enum(['none', 'daily', 'weekly', 'monthly']),
});

type FormValues = z.infer<typeof formSchema>;

export interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task | null;
  defaultCategory?: Task['category'];
}

const AddTaskModal = ({
  open,
  onOpenChange,
  onAddTask,
  editingTask,
  defaultCategory,
}: AddTaskModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: defaultCategory || 'mental',
      priority: 'medium',
      timeAllocation: '',
      recurring: 'none',
    },
  });

  useEffect(() => {
    if (editingTask) {
      form.reset({
        name: editingTask.name,
        description: editingTask.description || '',
        category: editingTask.category,
        priority: editingTask.priority,
        timeAllocation: editingTask.timeAllocation?.toString() || '',
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate) : undefined,
        recurring: editingTask.recurring,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        category: defaultCategory || 'mental',
        priority: 'medium',
        timeAllocation: '',
        recurring: 'none',
      });
    }
  }, [editingTask, form, defaultCategory]);

  const onSubmit = (values: FormValues) => {
    const task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      name: values.name,
      description: values.description || undefined,
      category: values.category,
      priority: values.priority,
      timeAllocation: parseInt(values.timeAllocation, 10),
      dueDate: values.dueDate,
      recurring: values.recurring,
      completed: false,
    };
    onAddTask(task);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto p-4 gap-2">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="text-lg">{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the details below to {editingTask ? 'update your' : 'create a new'} task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Task Name</FormLabel>
                  <FormControl>
                    <Input className="h-8" placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none h-16 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mental">Mental Wellness</SelectItem>
                        <SelectItem value="physical">Physical Wellness</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="fun">Fun</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="timeAllocation"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm">Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 30"
                        className="h-8"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm">Recurring</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm">Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full h-8 px-3 text-left font-normal text-sm',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
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
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full h-8 text-sm">
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
