import { useMemo } from "react";
import {
  type Identifier,
  useGetIdentity,
  useGetList,
  useTimeout,
  useTranslate,
} from "ra-core";
import { useIsMobile } from "@/hooks/use-mobile";

import { TaskListFilter } from "./TasksListFilter";
import {
  isBeforeFriday,
  isDone,
  isDueLater,
  isDueThisWeek,
  isDueToday,
  isDueTomorrow,
  isOverdue,
  isRecentlyDone,
} from "./tasksPredicate";

export const TasksListByDueDate = ({
  filterByContact,
  emptyPlaceholder,
  pendingPlaceholder,
}: {
  filterByContact?: Identifier;
  emptyPlaceholder?: React.ReactNode;
  pendingPlaceholder?: React.ReactNode;
}) => {
  const { identity } = useGetIdentity();
  const isMobile = useIsMobile();
  const translate = useTranslate();

  const { data: tasks, isPending } = useGetList(
    "tasks",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "due_date", order: "ASC" },
      filter: {
        ...(filterByContact != null
          ? { contact_id: filterByContact }
          : { sales_id: identity?.id }),
      },
    },
    { enabled: filterByContact != null ? true : !!identity },
  );

  const showContact = filterByContact == null;

  const ongoingTasks = useMemo(
    () => tasks?.filter((task) => !isDone(task) || isRecentlyDone(task)) || [],
    [tasks],
  );

  // Tasks without a due date get their own group: new Date(null) is 1970,
  // which would otherwise file every undated task under "Overdue".
  const datedTasks = useMemo(
    () => ongoingTasks.filter((task) => task.due_date != null),
    [ongoingTasks],
  );

  const noDateTasks = useMemo(
    () => ongoingTasks.filter((task) => task.due_date == null),
    [ongoingTasks],
  );

  const overdueTasks = useMemo(
    () =>
      datedTasks?.filter((task) => {
        return isOverdue(task.due_date);
      }) || [],
    [datedTasks],
  );

  const dueTodayTasks = useMemo(
    () =>
      datedTasks?.filter((task) => {
        return isDueToday(task.due_date);
      }) || [],
    [datedTasks],
  );

  const dueTomorrowTasks = useMemo(
    () => datedTasks?.filter((task) => isDueTomorrow(task.due_date)) || [],
    [datedTasks],
  );

  const dueThisWeekTasks = useMemo(
    () => datedTasks?.filter((task) => isDueThisWeek(task.due_date)) || [],
    [datedTasks],
  );

  const dueLaterTasks = useMemo(
    () => datedTasks?.filter((task) => isDueLater(task.due_date)) || [],
    [datedTasks],
  );

  const oneSecondHasPassed = useTimeout(1000);

  if (isPending && oneSecondHasPassed) {
    return pendingPlaceholder ?? null;
  }

  if (isPending) {
    return null;
  }

  if (!ongoingTasks.length) {
    return emptyPlaceholder ?? null;
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskListFilter
        tasks={overdueTasks}
        title={translate("resources.tasks.filters.overdue")}
        showContact={showContact}
        isMobile={isMobile}
      />
      <TaskListFilter
        tasks={dueTodayTasks}
        title={translate("resources.tasks.filters.today")}
        showContact={showContact}
        isMobile={isMobile}
      />
      <TaskListFilter
        tasks={dueTomorrowTasks}
        title={translate("resources.tasks.filters.tomorrow")}
        showContact={showContact}
        isMobile={isMobile}
      />
      {(!filterByContact || (filterByContact && isBeforeFriday())) && (
        <TaskListFilter
          tasks={dueThisWeekTasks}
          title={translate("resources.tasks.filters.this_week")}
          showContact={showContact}
          isMobile={isMobile}
        />
      )}
      <TaskListFilter
        tasks={dueLaterTasks}
        title={translate("resources.tasks.filters.later")}
        showContact={showContact}
        isMobile={isMobile}
      />
      <TaskListFilter
        tasks={noDateTasks}
        title={translate("resources.tasks.filters.no_date", { _: "No date" })}
        showContact={showContact}
        isMobile={isMobile}
      />
    </div>
  );
};
