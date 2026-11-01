create table if not exists public.vault_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  encrypted_data text not null,
  iv text not null,
  crypto_version smallint not null default 1 check (crypto_version = 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vault_entries_user_updated_idx
  on public.vault_entries (user_id, updated_at desc);

alter table public.vault_entries enable row level security;

revoke all on table public.vault_entries from anon, public;

drop policy if exists "Users can read their own vault entries" on public.vault_entries;
create policy "Users can read their own vault entries"
  on public.vault_entries
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own vault entries" on public.vault_entries;
create policy "Users can create their own vault entries"
  on public.vault_entries
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own vault entries" on public.vault_entries;
create policy "Users can update their own vault entries"
  on public.vault_entries
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own vault entries" on public.vault_entries;
create policy "Users can delete their own vault entries"
  on public.vault_entries
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.vault_entries to authenticated;

create or replace function public.set_vault_entry_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists set_vault_entry_updated_at on public.vault_entries;
create trigger set_vault_entry_updated_at
  before update on public.vault_entries
  for each row execute function public.set_vault_entry_updated_at();
