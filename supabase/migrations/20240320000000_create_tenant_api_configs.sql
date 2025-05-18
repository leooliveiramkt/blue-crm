-- Create tenant_api_configs table
create table if not exists public.tenant_api_configs (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references auth.users(id) on delete cascade not null,
  integration_id text not null,
  api_key text not null,
  api_url text,
  additional_config jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint tenant_api_configs_tenant_id_integration_id_key unique (tenant_id, integration_id)
);

-- Enable RLS
alter table public.tenant_api_configs enable row level security;

-- Create policies
create policy "Users can view their own API configs"
  on public.tenant_api_configs for select
  using (auth.uid() = tenant_id);

create policy "Users can insert their own API configs"
  on public.tenant_api_configs for insert
  with check (auth.uid() = tenant_id);

create policy "Users can update their own API configs"
  on public.tenant_api_configs for update
  using (auth.uid() = tenant_id);

create policy "Users can delete their own API configs"
  on public.tenant_api_configs for delete
  using (auth.uid() = tenant_id);

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_tenant_api_configs_updated_at
  before update on public.tenant_api_configs
  for each row
  execute function public.handle_updated_at(); 