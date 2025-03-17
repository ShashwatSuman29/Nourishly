-- Create the food_analyses table
create table public.food_analyses (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  food_items text[] not null,
  macros jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.food_analyses enable row level security;

-- Create policies
create policy "Users can view their own food analyses"
  on public.food_analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own food analyses"
  on public.food_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own food analyses"
  on public.food_analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own food analyses"
  on public.food_analyses for delete
  using (auth.uid() = user_id);

-- Create indexes
create index food_analyses_user_id_idx on public.food_analyses(user_id);
create index food_analyses_created_at_idx on public.food_analyses(created_at);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_updated_at
  before update on public.food_analyses
  for each row
  execute function public.handle_updated_at(); 