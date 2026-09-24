-- REVIEW ONLY — DO NOT RUN WITHOUT SEPARATE FOUNDER AND DATABASE APPROVAL.
--
-- Purpose: add independent development, IP, and commercial status fields to
-- project records. This file is intentionally outside supabase/migrations and
-- ends with ROLLBACK so inspection or an accidental console run does not apply
-- the proposed changes.

begin;

alter table public.projects
  add column if not exists development_stage text,
  add column if not exists ip_status text,
  add column if not exists commercial_status text,
  add column if not exists next_milestone text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_development_stage_check') then
    alter table public.projects add constraint projects_development_stage_check check (
      development_stage is null or development_stage in (
        'research_concept', 'system_architecture', 'prototype_engineering',
        'prototype_built', 'technical_validation', 'pilot_preparation',
        'pilot', 'validation_complete'
      )
    );
  end if;

  if not exists (select 1 from pg_constraint where conname = 'projects_ip_status_check') then
    alter table public.projects add constraint projects_ip_status_check check (
      ip_status is null or ip_status in (
        'not_filed', 'application_preparation', 'ip_filed',
        'patent_pending', 'patent_granted'
      )
    );
  end if;

  if not exists (select 1 from pg_constraint where conname = 'projects_commercial_status_check') then
    alter table public.projects add constraint projects_commercial_status_check check (
      commercial_status is null or commercial_status in (
        'not_offered', 'commercialization_planning', 'available_for_licensing',
        'licensed', 'commercial_operation'
      )
    );
  end if;
end $$;

-- Founder-approved UAV values. The stable slug prevents a broad update.
update public.projects
set development_stage = 'system_architecture',
    ip_status = 'patent_pending',
    commercial_status = 'commercialization_planning',
    next_milestone = 'Engineering Build Next'
where slug in ('autonomous-aerial-advertising-system', 'aerial-coordination');

-- Founder-approved smart-vending sequencing. The stable slug prevents a broad update.
update public.projects
set development_stage = 'research_concept',
    ip_status = 'patent_pending',
    commercial_status = 'not_offered',
    next_milestone = 'Planned After UAV Validation'
where slug in ('smart-vending-virtual-clothing-try-on', 'adaptive-interaction');

-- Approval procedure: review the matched rows and take a backup before replacing
-- the final ROLLBACK with COMMIT. Do not change unrelated projects automatically;
-- set their three fields manually through the admin panel after verification.
--
-- Recovery after an approved execution:
--   1. Restore project values from the pre-execution export, or set them to null.
--   2. Drop the three named check constraints.
--   3. Drop the four added columns only after confirming no application depends on them.

rollback;
