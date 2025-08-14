create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);
create index if not exists idx_profiles_email on public.profiles(email);

