-- Allow all supported interview UI languages.
alter table customer_discovery_interviews
drop constraint if exists customer_discovery_interviews_question_language_check;

alter table customer_discovery_interviews
add constraint customer_discovery_interviews_question_language_check
check (question_language in ('en', 'de', 'zh'));
