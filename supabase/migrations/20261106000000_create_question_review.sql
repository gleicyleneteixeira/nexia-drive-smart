-- Repetição espaçada por questão (estilo Anki) — histórico por usuário.
-- Rode no SQL Editor do Supabase (Dashboard -> SQL Editor -> New query -> Run).
-- Sem esta tabela o app funciona 100% local (localStorage); com ela, o
-- histórico passa a seguir o usuário em qualquer aparelho.

create table if not exists public.question_review (
  user_id          uuid not null references auth.users(id) on delete cascade,
  question_id      text not null,
  ok_count         integer not null default 0,
  err_count        integer not null default 0,
  reps             integer not null default 0,
  ease             double precision not null default 2.5,
  interval_days    double precision not null default 0,
  due_at           timestamptz not null default now(),
  last_answer_at   timestamptz not null default now(),
  last_wrong_at    timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.question_review enable row level security;

drop policy if exists "question_review_self" on public.question_review;
create policy "question_review_self" on public.question_review
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.question_review to authenticated;
grant all on public.question_review to service_role;

create index if not exists question_review_due_idx
  on public.question_review (user_id, due_at);
