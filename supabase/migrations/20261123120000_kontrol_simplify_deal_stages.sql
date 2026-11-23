-- Simplify Kontrolai's deal stages to Lead, Upfront discussions, Proposal sent, Build, Retainer
-- (plus On hold and Lost, kept off the pipeline line). Mirrors src/kontrolConfiguration.ts.
-- Existing deals move first: both review stages become Upfront discussions, Build sprint becomes Build.
update "public"."deals" set "stage" = 'upfront-discussions' where "stage" in ('review-proposed', 'review');
update "public"."deals" set "stage" = 'build' where "stage" = 'build-sprint';

update "public"."configuration"
set "config" = jsonb_set(
  jsonb_set("config", '{dealStages}', '[
    {"value": "lead", "label": "Lead"},
    {"value": "upfront-discussions", "label": "Upfront discussions"},
    {"value": "proposal-sent", "label": "Proposal sent"},
    {"value": "build", "label": "Build"},
    {"value": "retainer", "label": "Retainer"},
    {"value": "on-hold", "label": "On hold"},
    {"value": "lost", "label": "Lost"}
  ]'::jsonb),
  '{dealPipelineStatuses}', '["build", "retainer"]'::jsonb
)
where "id" = 1;
