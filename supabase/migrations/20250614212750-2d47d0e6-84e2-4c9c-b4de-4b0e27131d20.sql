
-- 1. Constituencies (with MLA info)
create table public.constituencies (
  id serial primary key,
  name text unique not null,
  mla_name text,
  mla_party text,
  mla_photo_url text,
  mla_phone text,
  mla_email text,
  office_address text,
  boundary_geojson jsonb
);

-- 2. Departments (generic: MCD, PWD, DJB, DTC, Police, etc.)
create table public.departments (
  id serial primary key,
  name text not null,
  description text,
  website text
);

-- 3. Department Regions/Zones (e.g., MCD zones, PWD divisions)
create table public.department_zones (
  id serial primary key,
  department_id integer references public.departments(id) on delete cascade,
  zone_name text not null,
  region text,
  office_address text
);

-- 4. Officers/HoDs for each zone/region/department
create table public.department_officers (
  id serial primary key,
  department_id integer references public.departments(id) on delete cascade,
  zone_id integer references public.department_zones(id) on delete set null,
  name text not null,
  designation text,
  email text,
  mobile text,
  escalation_level integer, -- 1 = AE, 2 = JE, etc.
  is_active boolean default true
);

-- 5. Escalation/Complaint Portals (per department/zone if needed)
create table public.complaint_portals (
  id serial primary key,
  department_id integer references public.departments(id) on delete cascade,
  portal_url text,
  escalation_path text, -- e.g., chain: AE > JE > EE > SE > Commissioner
  help_doc_url text
);

-- 6. Row-level security (RLS); allow all users to select data for public reference
alter table public.constituencies enable row level security;
create policy "Allow read access to all" on public.constituencies for select using (true);

alter table public.departments enable row level security;
create policy "Allow read access to all" on public.departments for select using (true);

alter table public.department_zones enable row level security;
create policy "Allow read access to all" on public.department_zones for select using (true);

alter table public.department_officers enable row level security;
create policy "Allow read access to all" on public.department_officers for select using (true);

alter table public.complaint_portals enable row level security;
create policy "Allow read access to all" on public.complaint_portals for select using (true);
