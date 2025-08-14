-- Optional helper migration to ensure profiles exists and RLS is permissive for reading own profile
alter table public.profiles enable row level security;
do $$ begin
  create policy "read_own_profile" on public.profiles
    for select using ( auth.uid() = id );
exception when others then null; end $$;
do $$ begin
  create policy "upsert_own_profile" on public.profiles
    for insert with check ( auth.uid() = id );
exception when others then null; end $$;
do $$ begin
  create policy "update_own_profile" on public.profiles
    for update using ( auth.uid() = id );
exception when others then null; end $$;


