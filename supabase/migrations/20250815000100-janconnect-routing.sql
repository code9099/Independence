-- Departments directory
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  dept_id text,
  dept_name text,
  category text,
  subcategories text,
  keywords text,
  city text,
  zone text,
  ward text,
  priority int,
  primary_email text,
  cc_emails text,
  phone text,
  website text,
  address text,
  notes text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Complaints registry
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  tracking_id text unique,
  title text,
  description text,
  category text,
  sub_category text,
  lat numeric,
  lng numeric,
  ward text,
  zone text,
  media_urls jsonb,
  reporter_id uuid,
  reporter_contact_hash text,
  status text check (status in ('under_review','assigned','wip','resolved')) default 'under_review',
  estimated_resolution_at timestamp with time zone,
  assigned_department_id uuid references public.departments(id),
  created_at timestamp with time zone default now()
);

-- Email events log
create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid references public.complaints(id) on delete cascade,
  department_id uuid references public.departments(id),
  to_email text,
  cc_emails text,
  subject text,
  status text check (status in ('sent','failed','queued','retried')),
  provider_message_id text,
  error text,
  payload_snapshot jsonb,
  created_at timestamp with time zone default now()
);

-- Helpful indexes
create index if not exists idx_departments_active on public.departments(active);
create index if not exists idx_departments_dept_id on public.departments(dept_id);
create index if not exists idx_departments_category on public.departments(category);
create index if not exists idx_complaints_tracking on public.complaints(tracking_id);
create index if not exists idx_email_events_complaint on public.email_events(complaint_id);


