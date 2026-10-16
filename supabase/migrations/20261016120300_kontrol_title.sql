-- The header shows the KONTROL[ai] wordmark, so the in-app title is just "CRM" (mirrors src/kontrolConfiguration.ts).
update "public"."configuration"
set "config" = jsonb_set("config", '{title}', '"CRM"'::jsonb)
where "id" = 1;
