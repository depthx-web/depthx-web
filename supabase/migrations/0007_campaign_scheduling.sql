-- Lets a campaign be scheduled for a future send instead of only "send now".
-- A cron-triggered route (src/app/api/cron/send-scheduled-campaigns/route.ts)
-- picks up anything with status = 'scheduled' and scheduled_at <= now().

alter type email_campaign_status add value 'scheduled';

alter table email_campaigns add column scheduled_at timestamptz;
