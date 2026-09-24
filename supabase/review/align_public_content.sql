-- REVIEW ONLY: DO NOT EXECUTE WITHOUT FOUNDER APPROVAL AND ENVIRONMENT CONFIRMATION.
-- This file is intentionally outside supabase/migrations and must not be run automatically.
-- It contains targeted, idempotent statements for a separately approved database application.
-- Before execution, export the affected rows and confirm the target Supabase environment.

begin;

-- Existing hosted databases need this field before Product Priority can be
-- managed from the project form. This remains review-only and is rolled back below.
alter table public.projects
  add column if not exists product_priority text;

-- Site settings singleton: approved homepage positioning only.
update public.site_settings
set
  hero_headline = 'Researching technologies.',
  hero_headline_accent = 'Building protected systems. Preparing them for market.',
  hero_subtext = 'Depth X is an R&D and technology commercialization company. Our first commercialization priority is a patent-pending autonomous multi-UAV platform for adaptive outdoor advertising and anonymous audience measurement. The platform is currently at the pre-prototype stage, with the engineering build as the next milestone.'
where id = 1
  and (
    hero_headline is distinct from 'Researching technologies.'
    or hero_headline_accent is distinct from 'Building protected systems. Preparing them for market.'
    or hero_subtext is distinct from 'Depth X is an R&D and technology commercialization company. Our first commercialization priority is a patent-pending autonomous multi-UAV platform for adaptive outdoor advertising and anonymous audience measurement. The platform is currently at the pre-prototype stage, with the engineering build as the next milestone.'
  );

-- First priority: never write an application number or ownership claim.
update public.projects
set
  status = 'pending',
  patent_number = null,
  granted_date = null,
  product_priority = 'The autonomous multi-UAV platform is Depth X Ltd''s first commercialization priority. The smart vending system is the second technology in the pipeline and will be developed for market after the UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.',
  overview = 'The autonomous multi-UAV platform is Depth X Ltd''s first commercialization priority. It is patent-pending and at the pre-prototype stage, with the engineering build as the next milestone. emQopter has confirmed its capability to engineer and build the complete four-UAV physical prototype. Its role is that of an external engineering collaborator.'
where slug = 'autonomous-aerial-advertising-system'
  and (
    status is distinct from 'pending'
    or patent_number is not null
    or granted_date is not null
    or product_priority is distinct from 'The autonomous multi-UAV platform is Depth X Ltd''s first commercialization priority. The smart vending system is the second technology in the pipeline and will be developed for market after the UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.'
    or overview is distinct from 'The autonomous multi-UAV platform is Depth X Ltd''s first commercialization priority. It is patent-pending and at the pre-prototype stage, with the engineering build as the next milestone. emQopter has confirmed its capability to engineer and build the complete four-UAV physical prototype. Its role is that of an external engineering collaborator.'
  );

-- Second pipeline product: never write an application number or grant claim.
update public.projects
set
  status = 'pending',
  patent_number = null,
  granted_date = null,
  product_priority = 'The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.',
  overview = 'The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.'
where slug = 'smart-vending-virtual-clothing-try-on'
  and (
    status is distinct from 'pending'
    or patent_number is not null
    or granted_date is not null
    or product_priority is distinct from 'The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.'
    or overview is distinct from 'The smart vending system is the second technology in the pipeline and will be developed for market after the autonomous multi-UAV platform advances through prototype engineering and validation. The two technologies are not planned for simultaneous launch.'
  );

-- Preserved origin article: replace the legally inaccurate origin narrative.
update public.news_posts
set
  excerpt = 'Depth X Ltd began with founder Marwen Ayadi''s marketing background and his development of an autonomous UAV advertising concept.',
  body = 'Depth X Ltd began with founder Marwen Ayadi''s marketing background and his development of an autonomous UAV advertising concept. Designing the system and preparing the patent applications raised broader questions about the relationship between traditional and digital marketing. Those questions led to the theoretical research that shaped Depth X Ltd as an R&D and technology commercialization company.'
where slug = 'why-we-started-depth-x'
  and (
    excerpt is distinct from 'Depth X Ltd began with founder Marwen Ayadi''s marketing background and his development of an autonomous UAV advertising concept.'
    or body is distinct from 'Depth X Ltd began with founder Marwen Ayadi''s marketing background and his development of an autonomous UAV advertising concept. Designing the system and preparing the patent applications raised broader questions about the relationship between traditional and digital marketing. Those questions led to the theoretical research that shaped Depth X Ltd as an R&D and technology commercialization company.'
  );

-- Review the affected rows before committing. Do not run COMMIT until founder approval.
rollback;

-- Recovery guidance: retain the pre-execution export of site_settings, the two project rows,
-- and the origin article row. Reapply that export if an approved execution needs reversal.
