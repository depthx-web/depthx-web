-- Site branding: a site-wide logo image (replaces the plain text wordmark
-- in the nav/footer when set) plus per-entry image support for trust bar
-- logos (previously name-only, despite the app type already having a
-- logoUrl field nothing ever populated).

alter table site_settings add column logo_url text;
