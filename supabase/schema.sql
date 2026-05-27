-- ============================================================
-- DuoFinanças — Schema completo para Supabase
-- Execute no SQL Editor do Supabase (Project > SQL Editor)
-- ============================================================

-- ============================================================
-- TABELAS
-- ============================================================

-- Profiles (criado automaticamente via trigger no auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  age integer,
  occupation text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Plans
create table if not exists public.plans (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  plan_type text check (plan_type in ('single', 'couple')) not null,
  partner_id uuid references public.profiles(id) on delete set null,

  -- Pessoa 1
  monthly_income numeric(12,2) not null default 0,
  has_extra_income boolean default false,
  extra_income_value numeric(12,2) default 0,
  extra_income_description text,
  has_emergency_fund boolean default false,
  emergency_fund_value numeric(12,2) default 0,
  has_overdue_debts boolean default false,

  -- Objetivo
  main_goal text check (main_goal in (
    'quitar_dividas', 'montar_reserva', 'investir',
    'comprar_algo', 'viajar', 'outro'
  )),
  goal_custom_description text,
  goal_timeframe text check (goal_timeframe in (
    '3_meses', '6_meses', '1_ano', '2_anos', '5_anos'
  )),
  goal_target_value numeric(12,2) default 0,

  -- Pessoa 2 (casal)
  partner_name text,
  partner_age integer,
  partner_occupation text,
  partner_monthly_income numeric(12,2) default 0,
  partner_has_extra_income boolean default false,
  partner_extra_income_value numeric(12,2) default 0,
  partner_extra_income_description text,
  partner_has_emergency_fund boolean default false,
  partner_emergency_fund_value numeric(12,2) default 0,
  partner_has_overdue_debts boolean default false,

  -- Config casal
  unified_finances text check (unified_finances in ('sim', 'parcialmente', 'nao')) default 'parcialmente',
  shared_expense_percentage integer default 50 check (shared_expense_percentage between 0 and 100),
  couple_goal text,
  couple_goal_timeframe text,

  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Expenses
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.plans(id) on delete cascade not null,
  category text not null,
  custom_label text,
  expense_type text check (expense_type in ('fixed', 'variable')) not null,
  amount numeric(12,2) not null default 0,
  ownership text check (ownership in ('shared', 'person_1', 'person_2')) default 'shared',
  icon text,
  created_at timestamptz default now()
);

-- Scenarios
create table if not exists public.scenarios (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.plans(id) on delete cascade not null,
  scenario_name text not null,
  removed_expenses uuid[] default '{}',
  adjusted_expenses jsonb default '[]',
  extra_savings numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now()
);

-- Goals
create table if not exists public.goals (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.plans(id) on delete cascade not null,
  title text not null,
  target_value numeric(12,2) not null,
  current_value numeric(12,2) default 0,
  deadline date,
  priority integer default 1,
  status text check (status in ('active', 'paused', 'completed')) default 'active',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.expenses enable row level security;
alter table public.scenarios enable row level security;
alter table public.goals enable row level security;

-- Profiles: cada usuário gerencia só o próprio
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Plans: dono ou parceiro têm acesso
create policy "Users manage own plans"
  on public.plans for all
  using (auth.uid() = owner_id or auth.uid() = partner_id)
  with check (auth.uid() = owner_id or auth.uid() = partner_id);

-- Expenses: acesso via plano
create policy "Users manage expenses of own plans"
  on public.expenses for all
  using (
    plan_id in (
      select id from public.plans
      where owner_id = auth.uid() or partner_id = auth.uid()
    )
  )
  with check (
    plan_id in (
      select id from public.plans
      where owner_id = auth.uid() or partner_id = auth.uid()
    )
  );

-- Scenarios: acesso via plano
create policy "Users manage scenarios of own plans"
  on public.scenarios for all
  using (
    plan_id in (
      select id from public.plans
      where owner_id = auth.uid() or partner_id = auth.uid()
    )
  )
  with check (
    plan_id in (
      select id from public.plans
      where owner_id = auth.uid() or partner_id = auth.uid()
    )
  );

-- Goals: acesso via plano
create policy "Users manage goals of own plans"
  on public.goals for all
  using (
    plan_id in (
      select id from public.plans
      where owner_id = auth.uid() or partner_id = auth.uid()
    )
  )
  with check (
    plan_id in (
      select id from public.plans
      where owner_id = auth.uid() or partner_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Função genérica para atualizar updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger em profiles
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- Trigger em plans
create trigger set_updated_at
  before update on public.plans
  for each row execute function public.update_updated_at();

-- Função para criar profile automaticamente ao cadastrar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger no auth.users (cria profile automaticamente)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ÍNDICES (performance)
-- ============================================================

create index if not exists idx_plans_owner_id on public.plans(owner_id);
create index if not exists idx_plans_partner_id on public.plans(partner_id);
create index if not exists idx_plans_active on public.plans(owner_id, is_active);
create index if not exists idx_expenses_plan_id on public.expenses(plan_id);
create index if not exists idx_expenses_type on public.expenses(plan_id, expense_type);
create index if not exists idx_goals_plan_id on public.goals(plan_id);
create index if not exists idx_scenarios_plan_id on public.scenarios(plan_id);

-- ============================================================
-- REALTIME (habilitar para sync do casal)
-- ============================================================

-- Adicione as tabelas abaixo em:
-- Supabase Dashboard > Database > Replication > supabase_realtime
-- ou execute:

alter publication supabase_realtime add table public.expenses;
alter publication supabase_realtime add table public.goals;
alter publication supabase_realtime add table public.plans;

-- ============================================================
-- COMUNHÃO DE BENS (N8N Integration)
-- Execute no SQL Editor do Supabase após o schema principal
-- ============================================================

-- Configuração por usuário (lida pelo N8N para enviar lembretes)
CREATE TABLE IF NOT EXISTS public.comunhao_bens_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Dados pessoais
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,  -- formato: 5584999999999 (DDI+DDD+numero, sem formatação)

  -- Dados financeiros
  renda NUMERIC(12,2) NOT NULL DEFAULT 0,
  percentual INTEGER NOT NULL DEFAULT 10 CHECK (percentual IN (10, 15)),
  tipo_vinculo TEXT NOT NULL DEFAULT 'Grupo de Oração'
    CHECK (tipo_vinculo IN ('Grupo de Oração', 'Comunidade de Aliança')),

  -- Status do mês atual
  status_mes_atual TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status_mes_atual IN ('pendente', 'devolvido')),
  meses_consecutivos INTEGER NOT NULL DEFAULT 0,

  -- Configuração do lembrete
  dia_lembrete INTEGER NOT NULL DEFAULT 5 CHECK (dia_lembrete BETWEEN 1 AND 28),
  lembrete_whatsapp BOOLEAN NOT NULL DEFAULT false,
  lembrete_browser BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Um registro por usuário
  UNIQUE(user_id)
);

-- RLS: cada usuário só vê/edita seus próprios dados
ALTER TABLE public.comunhao_bens_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cb config" ON public.comunhao_bens_config
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cb config" ON public.comunhao_bens_config
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cb config" ON public.comunhao_bens_config
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cb config" ON public.comunhao_bens_config
  FOR DELETE USING (auth.uid() = user_id);

-- Nota: o N8N usa a service_role key, que bypassa RLS automaticamente.
-- Não é necessária nenhuma policy adicional para o N8N.

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comunhao_bens_config_updated_at
  BEFORE UPDATE ON public.comunhao_bens_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Histórico de devoluções mensais
CREATE TABLE IF NOT EXISTS public.comunhao_bens_historico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  mes_referencia TEXT NOT NULL,           -- formato: "2026-04"
  valor_renda NUMERIC(12,2) NOT NULL,
  percentual_aplicado INTEGER NOT NULL,
  valor_devolvido NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'devolvido')),
  forma_devolucao TEXT,                   -- 'PIX', 'Urna', 'Transferência', 'App', 'Outro'
  data_devolucao TIMESTAMPTZ,
  lembrete_enviado BOOLEAN DEFAULT false,
  lembrete_enviado_em TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Um registro por mês por usuário
  UNIQUE(user_id, mes_referencia)
);

ALTER TABLE public.comunhao_bens_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cb history" ON public.comunhao_bens_historico
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cb history" ON public.comunhao_bens_historico
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cb history" ON public.comunhao_bens_historico
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cb history" ON public.comunhao_bens_historico
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
