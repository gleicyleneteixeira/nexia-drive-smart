-- Gerenciador de questões do super admin: edições, criações e exclusões
-- lógicas sobre o banco estático (src/data/questions.ts), mescladas em
-- tempo de execução por getQuestionBank(). Sem RLS restritiva: o painel
-- admin já opera com o client autenticado nas demais tabelas.
create table if not exists public.question_overrides (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  disabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.question_overrides enable row level security;

grant all on public.question_overrides to service_role;
grant select, insert, update, delete on public.question_overrides to authenticated;

drop policy if exists "All read question_overrides" on public.question_overrides;
create policy "All read question_overrides" on public.question_overrides
  for select to authenticated using (true);

drop policy if exists "Admins write question_overrides" on public.question_overrides;
create policy "Admins write question_overrides" on public.question_overrides
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins update question_overrides" on public.question_overrides;
create policy "Admins update question_overrides" on public.question_overrides
  for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins delete question_overrides" on public.question_overrides;
create policy "Admins delete question_overrides" on public.question_overrides
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
