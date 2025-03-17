-- Create the tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  priority text not null,
  time_allocation integer,
  due_date timestamp with time zone,
  recurring text not null default 'none',
  completed boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Create indexes
create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_category_idx on public.tasks(category);
create index tasks_created_at_idx on public.tasks(created_at);

-- Create function to automatically update updated_at
create or replace function public.handle_task_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_task_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_task_updated_at(); 