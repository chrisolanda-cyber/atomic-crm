// Kontrolai CRM configuration. Passed to <CRM> in App.tsx and mirrored in the
// kontrol_configuration migration, which seeds the database copy that the
// Settings page edits. Keep the two in step.

// Shown beside the KONTROL[ai] wordmark; the browser tab and PWA name say "Kontrolai CRM"
export const kontrolTitle = "CRM";

export const kontrolCurrency = "AUD";

export const kontrolDealStages = [
  { value: "lead", label: "Lead" },
  { value: "review-proposed", label: "Review proposed" },
  { value: "review", label: "Review" },
  { value: "proposal-sent", label: "Proposal sent" },
  { value: "build-sprint", label: "Build sprint" },
  { value: "retainer", label: "Retainer" },
  { value: "on-hold", label: "On hold" },
  { value: "lost", label: "Lost" },
];

// Stages counted as won: excluded from the open pipeline, shown as won on the chart
export const kontrolDealPipelineStatuses = ["build-sprint", "retainer"];

export const kontrolDealCategories = [
  { value: "review", label: "Review" },
  { value: "build-sprint", label: "Build sprint" },
  { value: "retainer", label: "Retainer" },
  { value: "other", label: "Other" },
];

export const kontrolTaskTypes = [
  { value: "none", label: "None" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "site-visit", label: "Site visit" },
  { value: "follow-up", label: "Follow-up" },
  { value: "proposal", label: "Proposal" },
];

// Outreach status of each contact (shown as Status on contacts and in filters)
export const kontrolNoteStatuses = [
  { value: "not-contacted", label: "Not contacted", color: "#8a949b" },
  { value: "not-researched", label: "Not researched", color: "#c4ccd2" },
  { value: "contacted", label: "Contacted, awaiting reply", color: "#9fd8d3" },
  { value: "in-conversation", label: "In conversation", color: "#58d8d0" },
  { value: "review-booked", label: "Review booked", color: "#2fb3a9" },
  { value: "proposal-sent", label: "Proposal sent", color: "#088880" },
  { value: "parked", label: "Parked", color: "#e8c47d" },
  { value: "dead", label: "Dead", color: "#e05a2b" },
];
