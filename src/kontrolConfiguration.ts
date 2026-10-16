// Kontrolai CRM configuration. Passed to <CRM> in App.tsx and mirrored in the
// kontrol_configuration migration, which seeds the database copy that the
// Settings page edits. Keep the two in step.

export const kontrolTitle = "Kontrolai CRM";

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
