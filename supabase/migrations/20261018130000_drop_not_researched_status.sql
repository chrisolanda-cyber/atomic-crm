-- Drop the "Not researched" outreach status: those contacts become "Not contacted".
update "public"."contacts" set "status" = 'not-contacted' where "status" = 'not-researched';

update "public"."configuration"
set "config" = jsonb_set(
  "config",
  '{noteStatuses}',
  (select coalesce(jsonb_agg(s), '[]'::jsonb)
   from jsonb_array_elements("config"->'noteStatuses') as s
   where s->>'value' <> 'not-researched')
)
where "id" = 1 and "config" ? 'noteStatuses';
