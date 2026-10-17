import { AddTask } from "../tasks/AddTask";
import { TasksListContent } from "../tasks/TasksListContent";

/** Today's work: open tasks grouped by due date, undated ones last. */
export const RunSheet = () => (
  <section aria-labelledby="run-sheet-heading">
    <div className="flex items-center justify-between gap-4 mb-4">
      <h2
        id="run-sheet-heading"
        className="font-condensed text-xl font-semibold tracking-tight"
      >
        Run sheet
      </h2>
      <AddTask display="icon" selectContact />
    </div>
    <TasksListContent />
  </section>
);
