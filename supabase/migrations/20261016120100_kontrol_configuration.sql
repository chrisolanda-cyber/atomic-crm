-- Seed Kontrolai's CRM configuration (mirrors src/kontrolConfiguration.ts).
-- Only fills an empty configuration, so changes saved later from the Settings page are never overwritten.
insert into "public"."configuration" ("id", "config")
values (1, '{
  "title": "Kontrolai CRM",
  "currency": "AUD",
  "dealStages": [
    {"value": "lead", "label": "Lead"},
    {"value": "review-proposed", "label": "Review proposed"},
    {"value": "review", "label": "Review"},
    {"value": "build-sprint", "label": "Build sprint"},
    {"value": "retainer", "label": "Retainer"},
    {"value": "lost", "label": "Lost"}
  ],
  "dealPipelineStatuses": ["build-sprint", "retainer"],
  "dealCategories": [
    {"value": "review", "label": "Review"},
    {"value": "build-sprint", "label": "Build sprint"},
    {"value": "retainer", "label": "Retainer"},
    {"value": "other", "label": "Other"}
  ],
  "taskTypes": [
    {"value": "none", "label": "None"},
    {"value": "call", "label": "Call"},
    {"value": "email", "label": "Email"},
    {"value": "meeting", "label": "Meeting"},
    {"value": "site-visit", "label": "Site visit"},
    {"value": "follow-up", "label": "Follow-up"},
    {"value": "proposal", "label": "Proposal"}
  ]
}'::jsonb)
on conflict ("id") do update
set "config" = excluded."config"
where "configuration"."config" = '{}'::jsonb;
