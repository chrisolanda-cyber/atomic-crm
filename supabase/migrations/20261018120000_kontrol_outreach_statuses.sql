-- Contact status holds Kontrolai's outreach status (mirrors kontrolNoteStatuses in src/kontrolConfiguration.ts).
update "public"."configuration"
set "config" = jsonb_set("config", '{noteStatuses}', '[
  {
    "value": "not-contacted",
    "label": "Not contacted",
    "color": "#8a949b"
  },
  {
    "value": "not-researched",
    "label": "Not researched",
    "color": "#c4ccd2"
  },
  {
    "value": "contacted",
    "label": "Contacted, awaiting reply",
    "color": "#9fd8d3"
  },
  {
    "value": "in-conversation",
    "label": "In conversation",
    "color": "#58d8d0"
  },
  {
    "value": "review-booked",
    "label": "Review booked",
    "color": "#2fb3a9"
  },
  {
    "value": "proposal-sent",
    "label": "Proposal sent",
    "color": "#088880"
  },
  {
    "value": "parked",
    "label": "Parked",
    "color": "#e8c47d"
  },
  {
    "value": "dead",
    "label": "Dead",
    "color": "#e05a2b"
  }
]'::jsonb)
where "id" = 1;
