-- Oracle's Clip product schema
-- Per-user rows use TEXT user_id (Better Auth ids / preview 'dev-user').

create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  handle text unique,
  bio text,
  timezone text,
  role text not null default 'creator',
  onboarding_completed boolean not null default false,
  onboarding_step integer not null default 0,
  demo_mode boolean not null default false,
  email_verified boolean not null default false,
  payouts_acknowledged boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on profiles (role);

create table if not exists platform_accounts (
  id text primary key,
  user_id text not null,
  platform text not null,
  status text not null default 'not_connected',
  handle text,
  external_id text,
  scopes text,
  last_error text,
  connected_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform, is_demo)
);
create index if not exists platform_accounts_user_idx on platform_accounts (user_id);

create table if not exists content_sources (
  id text primary key,
  user_id text not null,
  kind text not null,
  title text,
  original_filename text,
  mime_type text,
  duration_seconds double precision,
  width integer,
  height integer,
  file_size_bytes bigint,
  source_url text,
  thumbnail_data_url text,
  rights_status text not null default 'unknown',
  ownership_confirmed boolean not null default false,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists content_sources_user_idx on content_sources (user_id, created_at desc);

create table if not exists series (
  id text primary key,
  user_id text not null,
  source_id text,
  name text not null,
  description text,
  genre text,
  rights_status text not null default 'unknown',
  status text not null default 'draft',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists series_user_idx on series (user_id, created_at desc);

create table if not exists clips (
  id text primary key,
  user_id text not null,
  source_id text,
  series_id text,
  episode_number integer,
  season_number integer not null default 1,
  title text not null,
  description text,
  hook text,
  hashtags text,
  format text not null default 'short',
  aspect_ratio text not null default '9:16',
  status text not null default 'draft',
  start_seconds double precision not null default 0,
  end_seconds double precision not null default 0,
  duration_seconds double precision not null default 0,
  thumbnail_data_url text,
  caption_style text,
  branding_enabled boolean not null default false,
  confidence double precision,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clips_user_idx on clips (user_id, created_at desc);
create index if not exists clips_status_idx on clips (user_id, status);
create index if not exists clips_series_idx on clips (series_id, episode_number);

create table if not exists clip_versions (
  id text primary key,
  clip_id text not null,
  user_id text not null,
  version_number integer not null,
  spec_json text not null,
  created_at timestamptz not null default now()
);
create index if not exists clip_versions_clip_idx on clip_versions (clip_id, version_number);

create table if not exists clip_candidates (
  id text primary key,
  source_id text not null,
  user_id text not null,
  start_seconds double precision not null,
  end_seconds double precision not null,
  title_suggestion text,
  hook text,
  moment_kind text,
  confidence double precision,
  platform_fit_json text,
  selected boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists clip_candidates_source_idx on clip_candidates (source_id);

create table if not exists compliance_decisions (
  id text primary key,
  clip_id text not null,
  user_id text not null,
  publishable text not null,
  ai_disclosure text not null,
  commercial_disclosure text not null,
  copyright_risk text not null,
  monetization text not null,
  account_risk text not null,
  content_repetition_risk text not null,
  rights_status text not null,
  rationale text not null,
  policy_version text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists compliance_decisions_clip_idx on compliance_decisions (clip_id, created_at desc);

create table if not exists publications (
  id text primary key,
  clip_id text not null,
  user_id text not null,
  platform text not null,
  status text not null,
  failure_reason text,
  failure_code text,
  external_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists publications_user_idx on publications (user_id, created_at desc);
create index if not exists publications_clip_idx on publications (clip_id);

create table if not exists publishing_jobs (
  id text primary key,
  publication_id text not null,
  user_id text not null,
  clip_id text not null,
  platform text not null,
  stage text not null,
  status text not null,
  detail text,
  attempt integer not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists publishing_jobs_user_idx on publishing_jobs (user_id, created_at desc);

create table if not exists engine_jobs (
  id text primary key,
  user_id text,
  clip_id text,
  source_id text,
  series_id text,
  type text not null,
  stage text not null,
  status text not null,
  progress integer not null default 0,
  detail text,
  error text,
  retry_count integer not null default 0,
  worker_id text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists engine_jobs_user_idx on engine_jobs (user_id, created_at desc);
create index if not exists engine_jobs_status_idx on engine_jobs (status, stage);

create table if not exists engine_events (
  id text primary key,
  job_id text,
  user_id text,
  clip_id text,
  kind text not null,
  message text not null,
  payload_json text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists engine_events_job_idx on engine_events (job_id, created_at);
create index if not exists engine_events_user_idx on engine_events (user_id, created_at desc);

create table if not exists analytics_snapshots (
  id text primary key,
  user_id text not null,
  clip_id text,
  series_id text,
  platform text not null,
  views bigint not null default 0,
  qualified_views bigint not null default 0,
  watch_time_seconds bigint not null default 0,
  engagements bigint not null default 0,
  likes bigint not null default 0,
  comments bigint not null default 0,
  shares bigint not null default 0,
  followers_gained integer not null default 0,
  collected_at timestamptz not null default now(),
  is_demo boolean not null default false
);
create index if not exists analytics_user_idx on analytics_snapshots (user_id, collected_at desc);

create table if not exists earnings_ledger (
  id text primary key,
  user_id text not null,
  clip_id text,
  series_id text,
  platform text,
  revenue_source text not null default 'platform',
  kind text not null,
  status text not null,
  amount_cents integer not null,
  currency text not null default 'USD',
  note text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists earnings_ledger_user_idx on earnings_ledger (user_id, created_at desc);
create index if not exists earnings_ledger_kind_idx on earnings_ledger (user_id, kind, status, is_demo);

create table if not exists withdrawals (
  id text primary key,
  user_id text not null,
  amount_cents integer not null,
  status text not null,
  destination_kind text,
  failure_reason text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists withdrawals_user_idx on withdrawals (user_id, created_at desc);

create table if not exists transactions (
  id text primary key,
  user_id text not null,
  kind text not null,
  amount_cents integer not null,
  status text not null,
  reference_id text,
  description text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_idx on transactions (user_id, created_at desc);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  body text not null,
  kind text not null,
  href text,
  read_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

create table if not exists policies (
  id text primary key,
  platform text not null,
  topic text not null,
  version text not null,
  summary text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists policy_changes (
  id text primary key,
  policy_id text,
  platform text not null,
  topic text not null,
  classification text not null,
  impact text,
  stage text not null,
  source_url text,
  summary text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_events (
  id text primary key,
  user_id text,
  actor_id text,
  action text not null,
  entity_type text,
  entity_id text,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_user_idx on audit_events (user_id, created_at desc);

create table if not exists workflows (
  id text primary key,
  user_id text not null,
  name text not null,
  cadence text,
  source_id text,
  clip_count integer not null default 5,
  auto_publish boolean not null default false,
  status text not null default 'paused',
  last_run_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists revenue_opportunities (
  id text primary key,
  user_id text not null,
  series_id text,
  clip_id text,
  title text not null,
  recommendation text not null,
  platform text,
  format text,
  estimated_band text,
  confidence double precision,
  reason text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists revenue_opportunities_user_idx on revenue_opportunities (user_id, created_at desc);
