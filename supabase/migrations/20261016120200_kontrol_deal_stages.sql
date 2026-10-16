-- Add "Proposal sent" and "On hold" to Kontrolai's deal stages (mirrors src/kontrolConfiguration.ts).
update "public"."configuration"
set "config" = jsonb_set("config", '{dealStages}', '[
  {"value": "lead", "label": "Lead"},
  {"value": "review-proposed", "label": "Review proposed"},
  {"value": "review", "label": "Review"},
  {"value": "proposal-sent", "label": "Proposal sent"},
  {"value": "build-sprint", "label": "Build sprint"},
  {"value": "retainer", "label": "Retainer"},
  {"value": "on-hold", "label": "On hold"},
  {"value": "lost", "label": "Lost"}
]'::jsonb)
where "id" = 1;
