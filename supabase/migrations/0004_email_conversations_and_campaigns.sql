-- Adds outbound reply tracking for contact messages ("manage email
-- conversations") and a simple email marketing campaign table ("manage
-- email marketing"). Actually sending either requires SMTP_* env vars —
-- see src/lib/email/. These tables just persist what was sent and when.

create table message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references contact_messages (id) on delete cascade,
  body text not null,
  sent_by uuid references profiles (id) on delete set null,
  sent_at timestamptz not null default now()
);

alter table message_replies enable row level security;

-- Same trust level as contact_messages itself: any signed-in editor/admin
-- can read and log a reply. No public access at all.
create policy "editors manage message_replies" on message_replies for all
  using (is_editor_or_admin()) with check (is_editor_or_admin());

create type email_campaign_status as enum ('draft', 'sent', 'failed');

create table email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  status email_campaign_status not null default 'draft',
  recipient_count int not null default 0,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table email_campaigns enable row level security;

-- Bulk-sending to every subscriber is a higher-stakes action than regular
-- content edits (deliverability/reputation, and it's hard to "undo" a send)
-- — restricted to admins only, unlike the editor-or-admin write policies
-- used elsewhere. Editors can still read past campaigns for visibility.
create policy "editors read email_campaigns" on email_campaigns for select using (is_editor_or_admin());
create policy "admins write email_campaigns" on email_campaigns for all
  using (is_admin()) with check (is_admin());
