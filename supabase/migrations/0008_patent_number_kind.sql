-- Whether projects.patent_number is a filing/application number or a
-- granted patent number is now an explicit admin choice, not inferred from
-- status (a project can be "Available for Licensing" status while still
-- only having a filing number, for example).

create type patent_number_kind as enum ('application', 'patent');

alter table projects add column patent_number_kind patent_number_kind not null default 'application';

-- Backfill: keep current display behavior for existing rows (granted status
-- implied "Patent No." before this migration).
update projects set patent_number_kind = 'patent' where status = 'granted';
