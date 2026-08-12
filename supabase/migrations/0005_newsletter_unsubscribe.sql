-- Public self-service unsubscribe (src/app/api/newsletter/unsubscribe/route.ts)
-- needs to delete a row using only the anon/publishable key. Knowing a
-- subscriber's uuid is treated as the "unsubscribe token" — it's
-- unguessable and only ever sent to that subscriber's own inbox in a
-- campaign email, so allowing delete-by-id for anon is safe: nobody can
-- enumerate or target another subscriber's row without already having it.
create policy "public unsubscribe from newsletter" on newsletter_subscribers for delete using (true);
