-- DevPrint Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Technologies table
create table if not exists technologies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  logo_url text,
  website_url text,
  github_url text,
  npm_package text,
  github_stars integer,
  npm_weekly_downloads integer,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  best_for text[] not null default '{}',
  learning_curve text not null check (learning_curve in ('beginner', 'intermediate', 'advanced')),
  community_size text not null check (community_size in ('small', 'medium', 'large')),
  maturity text not null check (maturity in ('emerging', 'growing', 'mature', 'declining')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Comparisons table
create table if not exists comparisons (
  id uuid primary key default uuid_generate_v4(),
  tech_a_id uuid not null references technologies(id) on delete cascade,
  tech_b_id uuid not null references technologies(id) on delete cascade,
  comparison_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(tech_a_id, tech_b_id)
);

-- User profiles table
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'developer' check (role in ('developer', 'contributor', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project plans table
create table if not exists project_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  selections jsonb not null default '{}',
  config_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contributions table
create table if not exists contributions (
  id uuid primary key default uuid_generate_v4(),
  contributor_id uuid not null references auth.users(id) on delete cascade,
  technology_data jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_id uuid references auth.users(id),
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Eval results table (for eval system)
create table if not exists eval_results (
  id uuid primary key default uuid_generate_v4(),
  sprint text not null,
  dimension text not null,
  score numeric not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Row Level Security (RLS)
alter table technologies enable row level security;
alter table comparisons enable row level security;
alter table user_profiles enable row level security;
alter table project_plans enable row level security;
alter table contributions enable row level security;

-- Technologies: everyone can read
create policy "Technologies are viewable by everyone"
  on technologies for select
  using (true);

-- Technologies: only admins can insert/update/delete
create policy "Admins can manage technologies"
  on technologies for all
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

-- Comparisons: everyone can read
create policy "Comparisons are viewable by everyone"
  on comparisons for select
  using (true);

-- User profiles: users can read all profiles, update own
create policy "Profiles are viewable by everyone"
  on user_profiles for select
  using (true);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

-- Project plans: users can manage their own plans
create policy "Users can manage own plans"
  on project_plans for all
  using (auth.uid() = user_id);

-- Contributions: contributors can insert, read own; admins can manage all
create policy "Contributors can insert contributions"
  on contributions for insert
  with check (auth.uid() = contributor_id);

create policy "Contributors can view own contributions"
  on contributions for select
  using (
    auth.uid() = contributor_id
    or exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Admins can manage contributions"
  on contributions for update
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger technologies_updated_at
  before update on technologies
  for each row execute function update_updated_at();

create trigger user_profiles_updated_at
  before update on user_profiles
  for each row execute function update_updated_at();

create trigger project_plans_updated_at
  before update on project_plans
  for each row execute function update_updated_at();

create trigger contributions_updated_at
  before update on contributions
  for each row execute function update_updated_at();
