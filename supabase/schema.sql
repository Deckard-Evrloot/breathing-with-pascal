-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  full_name text,
  role text check (role in ('teacher', 'student')),
  slug text unique, -- for marketing page
  avatar_url text,
  created_at timestamptz default now()
);

-- Sessions Table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id),
  teacher_id uuid references public.users(id), -- Creator
  start_time timestamptz not null,
  is_habit boolean default false,
  status text check (status in ('locked', 'active', 'completed')),
  notes text,
  created_at timestamptz default now()
);

-- Session Content Table
create table public.session_content (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade,
  asset_url text,
  asset_type text check (asset_type in ('audio', 'pdf', 'video')),
  title text,
  created_at timestamptz default now()
);

-- Homework Table
create table public.homework (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade,
  prompt text not null,
  response_text text,
  response_file_url text,
  is_complete boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Breath Routines Table (for Breath Tool)
create table public.breath_routines (
  id uuid default gen_random_uuid() primary key,
  name text,
  sequence_json jsonb, -- Stores the RoutineStep[] array
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- RLS Policies (Basic Setup)
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.session_content enable row level security;
alter table public.homework enable row level security;
alter table public.breath_routines enable row level security;

-- Policies can be properly defined later, but here are some basics:
-- Users can view their own profile
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

-- Teachers can view all profiles? Or just their students? For now, allow teachers to view all.
create policy "Teachers can view all profiles" on public.users
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'teacher'));

-- Marketing slugs might need public access?
create policy "Public can view teacher profiles by slug" on public.users
  for select using (role = 'teacher'); 

-- Sessions: Students see their own, Teachers see all created by them
create policy "Students see own sessions" on public.sessions
  for select using (student_id = auth.uid());

create policy "Teachers see sessions" on public.sessions
  for select using (teacher_id = auth.uid());

-- ... (More policies would be needed for a prod app)
