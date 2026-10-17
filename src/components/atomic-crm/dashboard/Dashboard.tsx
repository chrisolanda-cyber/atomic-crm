import { useGetList } from "ra-core";

import type { Contact, ContactNote } from "../types";
import { ActivityLog } from "../activity/ActivityLog";
import { CampaignProgress } from "./CampaignProgress";
import { DashboardStepper } from "./DashboardStepper";
import { PipelineLine } from "./PipelineLine";
import { RunSheet } from "./RunSheet";
import { Welcome } from "./Welcome";

export const Dashboard = () => {
  const {
    data: dataContact,
    total: totalContact,
    isPending: isPendingContact,
  } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalContactNotes, isPending: isPendingContactNotes } =
    useGetList<ContactNote>("contact_notes", {
      pagination: { page: 1, perPage: 1 },
    });

  const isPending = isPendingContact || isPendingContactNotes;

  if (isPending) {
    return null;
  }

  if (!totalContact) {
    return <DashboardStepper step={1} />;
  }

  if (!totalContactNotes) {
    return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
  }

  // Kontrolai layout: the pipeline across the top, then today's work beside
  // campaign progress and recent activity.
  return (
    <div className="flex flex-col gap-10 mt-2 mb-10">
      {import.meta.env.VITE_IS_DEMO === "true" ? <Welcome /> : null}
      <PipelineLine />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
        <div className="lg:col-span-7">
          <RunSheet />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-10">
          <CampaignProgress />
          <section aria-labelledby="activity-heading">
            <h2
              id="activity-heading"
              className="font-condensed text-xl font-semibold tracking-tight mb-4"
            >
              Latest activity
            </h2>
            <ActivityLog pageSize={8} />
          </section>
        </div>
      </div>
    </div>
  );
};
