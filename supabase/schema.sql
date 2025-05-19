-- Enable RLS
alter table auth.users enable row level security;

-- Create tables
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text check (role in ('admin', 'vendedor', 'estoque')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.produtos (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  descricao text,
  preco decimal(10,2) not null,
  estoque_atual integer not null default 0,
  estoque_minimo integer not null default 5,
  categoria text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.vendas (
  id uuid default uuid_generate_v4() primary key,
  vendedor_id uuid references public.profiles(id) not null,
  cliente_nome text not null,
  valor_total decimal(10,2) not null,
  status text check (status in ('pendente', 'aprovada', 'entregue', 'cancelada')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.venda_itens (
  id uuid default uuid_generate_v4() primary key,
  venda_id uuid references public.vendas(id) not null,
  produto_id uuid references public.produtos(id) not null,
  quantidade integer not null,
  preco_unitario decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.movimentacoes_estoque (
  id uuid default uuid_generate_v4() primary key,
  produto_id uuid references public.produtos(id) not null,
  tipo text check (tipo in ('entrada', 'saida')) not null,
  quantidade integer not null,
  motivo text,
  usuario_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
create policy "Profiles are viewable by users who created them."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Enable RLS on all tables
alter table public.produtos enable row level security;
alter table public.vendas enable row level security;
alter table public.venda_itens enable row level security;
alter table public.movimentacoes_estoque enable row level security;

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'vendedor');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 