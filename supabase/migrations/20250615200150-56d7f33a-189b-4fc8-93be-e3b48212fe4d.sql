
-- 1. Expand "constituencies" table if needed (already stores basic MLA info)
-- 2. Create table for department officers (if not already present)
-- 3. Add extra columns for department/role-specific contacts if needed
-- 4. Ensure RLS enables public read-permission for officer lookup

-- (Table exists, double-check structure)
create table if not exists public.department_officers (
  id serial primary key,
  department_id integer references public.departments(id) on delete cascade,
  zone_id integer references public.department_zones(id) on delete set null,
  name text not null,
  designation text,
  email text,
  mobile text,
  escalation_level integer,
  is_active boolean default true
);

-- Make sure "department_officers" table is publicly readable for officer lookups
alter table public.department_officers enable row level security;
create policy "Allow read access to all on officers"
  on public.department_officers
  for select using (true);

-- Ensure "constituencies" table is also public
alter table public.constituencies enable row level security;
create policy "Allow read access to all on constituencies"
  on public.constituencies
  for select using (true);

-- Done: Now you'll be able to sync officer/MLA info and expose via API.
