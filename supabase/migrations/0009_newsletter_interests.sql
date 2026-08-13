create type newsletter_interest as enum ('news', 'investment', 'research', 'partnership');

-- Existing subscribers keep receiving everything they already implicitly
-- got (every campaign, unfiltered) — defaulting to all four interests
-- preserves that behavior; new signups can narrow it at signup or later
-- from the self-service management page.
alter table newsletter_subscribers
  add column interests newsletter_interest[] not null
  default array['news', 'investment', 'research', 'partnership']::newsletter_interest[];

-- null = send to every subscriber regardless of interest (current behavior).
alter table email_campaigns
  add column audience_interest newsletter_interest;

-- No UPDATE policy existed on newsletter_subscribers at all yet (only
-- INSERT for public signup and DELETE for admin/unsubscribe) — needed so
-- admins can edit a subscriber's interests directly from the admin panel.
-- The public self-service management page intentionally bypasses this via
-- the service-role client instead of a public policy, for the same reason
-- there's no public SELECT policy: keeping the subscriber list unreadable
-- through the anon API key.
create policy "admins update newsletter_subscribers"
  on newsletter_subscribers for update
  using (is_admin())
  with check (is_admin());
