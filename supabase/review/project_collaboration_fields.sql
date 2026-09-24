-- REVIEW ONLY — DO NOT RUN WITHOUT SEPARATE FOUNDER AND DATABASE APPROVAL.
--
-- Purpose: add optional, admin-managed public collaboration descriptions to
-- project records. This file is outside supabase/migrations and ends with
-- ROLLBACK so it cannot apply changes when reviewed as written.

begin;

alter table public.projects
  add column if not exists research_collaboration text,
  add column if not exists engineering_collaboration text;

-- Founder-approved public engineering-collaboration wording for the UAV project.
-- The stable slug prevents a broad update. No research collaborator is asserted.
update public.projects
set engineering_collaboration =
  'emQopter GmbH is an external engineering collaborator supporting the planned prototype engineering phase.'
where slug = 'autonomous-aerial-advertising-system';

-- Review the matched project row before any separately approved execution.
-- Recovery guidance: restore the two collaboration values from the pre-run
-- export. Drop the columns only after confirming the application no longer
-- depends on them.

rollback;
