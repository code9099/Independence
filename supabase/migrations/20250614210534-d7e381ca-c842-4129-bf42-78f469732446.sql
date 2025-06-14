
-- Create profiles table to store user data associated with each auth user
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Allow users to manage only their row
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can delete their own profile" on public.profiles
  for delete using (auth.uid() = id);

-- Optional: insert a row automatically when a user signs up
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger to Supabase auth.users on insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();
