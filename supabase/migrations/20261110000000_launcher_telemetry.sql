create table if not exists public.launcher_installations (
  installation_hash text primary key check (char_length(installation_hash) = 64),
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  app_version text not null default 'unknown',
  os text not null default 'unknown',
  arch text not null default 'unknown',
  sessions_count bigint not null default 0
);

create table if not exists public.launcher_sessions (
  session_hash text primary key check (char_length(session_hash) = 64),
  installation_hash text not null references public.launcher_installations(installation_hash) on delete cascade,
  started_at timestamptz not null default now(),
  last_heartbeat timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer,
  app_version text not null default 'unknown',
  os text not null default 'unknown'
);

create index if not exists launcher_installations_last_seen_idx on public.launcher_installations(last_seen desc);
create index if not exists launcher_installations_first_seen_idx on public.launcher_installations(first_seen desc);
create index if not exists launcher_sessions_started_at_idx on public.launcher_sessions(started_at desc);
create index if not exists launcher_sessions_installation_idx on public.launcher_sessions(installation_hash);

alter table public.launcher_installations enable row level security;
alter table public.launcher_sessions enable row level security;

create or replace function public.record_launcher_event(
  p_installation_hash text,
  p_session_hash text,
  p_event text,
  p_app_version text,
  p_os text,
  p_arch text,
  p_duration_seconds integer default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_sessions integer := 0;
begin
  if p_event not in ('install', 'heartbeat', 'session_start', 'session_end') then
    raise exception 'Unsupported launcher event';
  end if;

  insert into public.launcher_installations (installation_hash, app_version, os, arch)
  values (p_installation_hash, p_app_version, p_os, p_arch)
  on conflict (installation_hash) do update set
    last_seen = now(),
    app_version = excluded.app_version,
    os = excluded.os,
    arch = excluded.arch;

  if p_event = 'session_start' and p_session_hash is not null then
    insert into public.launcher_sessions (session_hash, installation_hash, app_version, os)
    values (p_session_hash, p_installation_hash, p_app_version, p_os)
    on conflict (session_hash) do nothing;
    get diagnostics inserted_sessions = row_count;
    if inserted_sessions = 1 then
      update public.launcher_installations
      set sessions_count = sessions_count + 1
      where installation_hash = p_installation_hash;
    end if;
  elsif p_event = 'heartbeat' and p_session_hash is not null then
    insert into public.launcher_sessions (session_hash, installation_hash, app_version, os)
    values (p_session_hash, p_installation_hash, p_app_version, p_os)
    on conflict (session_hash) do update set
      last_heartbeat = now(),
      app_version = excluded.app_version,
      os = excluded.os;
  elsif p_event = 'session_end' and p_session_hash is not null then
    insert into public.launcher_sessions (
      session_hash, installation_hash, ended_at, duration_seconds, app_version, os
    ) values (
      p_session_hash, p_installation_hash, now(), p_duration_seconds, p_app_version, p_os
    )
    on conflict (session_hash) do update set
      last_heartbeat = now(),
      ended_at = now(),
      duration_seconds = coalesce(
        p_duration_seconds,
        greatest(0, extract(epoch from (now() - launcher_sessions.started_at))::integer)
      ),
      app_version = excluded.app_version,
      os = excluded.os;
  end if;
end;
$$;

create or replace function public.get_launcher_admin_stats(p_days integer default 30)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with requested_days as (
    select generate_series(
      current_date - (greatest(7, least(coalesce(p_days, 30), 90)) - 1),
      current_date,
      interval '1 day'
    )::date as day
  ),
  daily_series as (
    select
      day,
      (select count(*) from public.launcher_installations i where i.first_seen::date = day)::integer as installations,
      (select count(distinct s.installation_hash) from public.launcher_sessions s where s.last_heartbeat::date = day)::integer as active_players,
      (select count(*) from public.launcher_sessions s where s.started_at::date = day)::integer as sessions
    from requested_days
  ),
  platform_totals as (
    select os as name, count(*)::integer as count
    from public.launcher_installations
    group by os
    order by count desc
  ),
  version_totals as (
    select app_version as name, count(*)::integer as count
    from public.launcher_installations
    where last_seen >= now() - interval '30 days'
    group by app_version
    order by count desc
  )
  select jsonb_build_object(
    'overview', jsonb_build_object(
      'totalInstallations', (select count(*) from public.launcher_installations),
      'activePlayers', (select count(*) from public.launcher_installations where last_seen >= now() - interval '5 minutes'),
      'dailyActivePlayers', (select count(*) from public.launcher_installations where last_seen >= date_trunc('day', now())),
      'monthlyActivePlayers', (select count(*) from public.launcher_installations where last_seen >= now() - interval '30 days'),
      'sessionsToday', (select count(*) from public.launcher_sessions where started_at >= date_trunc('day', now())),
      'averageSessionMinutes', coalesce((select round(avg(duration_seconds)::numeric / 60, 1) from public.launcher_sessions where duration_seconds is not null), 0)
    ),
    'series', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', to_char(day, 'YYYY-MM-DD'),
        'installations', installations,
        'activePlayers', active_players,
        'sessions', sessions
      ) order by day) from daily_series
    ), '[]'::jsonb),
    'platforms', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name,
        'count', count,
        'percentage', round(count::numeric * 100 / nullif((select count(*) from public.launcher_installations), 0), 1)
      ) order by count desc) from platform_totals
    ), '[]'::jsonb),
    'versions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name,
        'count', count,
        'percentage', round(count::numeric * 100 / nullif((select count(*) from public.launcher_installations where last_seen >= now() - interval '30 days'), 0), 1)
      ) order by count desc) from version_totals
    ), '[]'::jsonb)
  );
$$;

revoke all on public.launcher_installations from anon, authenticated;
revoke all on public.launcher_sessions from anon, authenticated;
revoke all on function public.record_launcher_event(text, text, text, text, text, text, integer) from public, anon, authenticated;
revoke all on function public.get_launcher_admin_stats(integer) from public, anon, authenticated;
grant execute on function public.record_launcher_event(text, text, text, text, text, text, integer) to service_role;
grant execute on function public.get_launcher_admin_stats(integer) to service_role;
