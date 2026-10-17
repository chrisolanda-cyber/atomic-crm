import { useGetList, useGetMany } from "ra-core";
import { Link } from "react-router";
import { startOfToday } from "date-fns";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Company, Deal } from "../types";

// Stages shown below the line rather than on it: they are not steps forward.
const OFF_LINE_STAGES = ["on-hold", "lost"];

const formatAmount = (amount: number, currency: string) =>
  // en-US spells AUD as "A$", which reads unambiguously next to other currencies
  amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    notation: "compact",
    maximumFractionDigits: 1,
  });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });

/**
 * The deal pipeline drawn as a line of stage nodes, each deal hanging under its
 * stage. Won stages (dealPipelineStatuses) are filled; empty stages are hollow.
 */
export const PipelineLine = () => {
  const { dealStages, dealPipelineStatuses, currency } =
    useConfigurationContext();
  const { data: deals = [], isPending } = useGetList<Deal>("deals", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "index", order: "ASC" },
    filter: { "archived_at@is": null },
  });
  const companyIds = [...new Set(deals.map((deal) => deal.company_id))];
  const { data: companies = [] } = useGetMany<Company>(
    "companies",
    { ids: companyIds },
    { enabled: companyIds.length > 0 },
  );
  const companyName = (deal: Deal) =>
    companies.find((company) => company.id === deal.company_id)?.name;

  if (isPending) return null;

  const lineStages = dealStages.filter(
    (stage) => !OFF_LINE_STAGES.includes(stage.value),
  );
  const offLineStages = dealStages.filter((stage) =>
    OFF_LINE_STAGES.includes(stage.value),
  );
  const isWon = (stage: string) => dealPipelineStatuses.includes(stage);
  const openDeals = deals.filter(
    (deal) => !isWon(deal.stage) && !OFF_LINE_STAGES.includes(deal.stage),
  );
  const openValue = openDeals.reduce((sum, deal) => sum + deal.amount, 0);
  const today = startOfToday();

  return (
    <section aria-labelledby="pipeline-heading" className="pb-8 border-b">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-6">
        <h2
          id="pipeline-heading"
          className="font-condensed text-2xl font-semibold tracking-tight"
        >
          Pipeline
        </h2>
        <p className="text-muted-foreground">
          <span className="font-display text-xl text-foreground">
            {formatAmount(openValue, currency)}
          </span>{" "}
          open across {openDeals.length}{" "}
          {openDeals.length === 1 ? "deal" : "deals"}
        </p>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <ol
          className="grid gap-x-4 min-w-[720px]"
          style={{
            gridTemplateColumns: `repeat(${lineStages.length}, minmax(0, 1fr))`,
          }}
        >
          {lineStages.map((stage, index) => {
            const stageDeals = deals.filter(
              (deal) => deal.stage === stage.value,
            );
            const stageValue = stageDeals.reduce(
              (sum, deal) => sum + deal.amount,
              0,
            );
            const won = isWon(stage.value);
            const isLast = index === lineStages.length - 1;
            return (
              <li key={stage.value} className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground">
                  {`// ${String(index + 1).padStart(2, "0")}`}
                </span>
                <span className="font-condensed text-base font-semibold leading-tight mt-0.5 min-h-10">
                  {stage.label}
                </span>

                {/* Node and the hairline running to the next stage */}
                <div className="relative h-4 my-3" aria-hidden="true">
                  {!isLast && (
                    <span className="absolute top-1/2 left-2 -right-4 h-px -translate-y-1/2 bg-foreground/25" />
                  )}
                  <span
                    className={
                      "absolute top-0 left-0 size-4 rounded-full border-2 " +
                      (stageDeals.length === 0
                        ? "border-foreground/25 bg-background"
                        : won
                          ? "border-primary bg-primary ring-4 ring-primary/25"
                          : "border-primary bg-primary")
                    }
                  />
                </div>

                <p className="text-sm text-muted-foreground tabular-nums">
                  {stageDeals.length === 0
                    ? "None"
                    : `${stageDeals.length} ${stageDeals.length === 1 ? "deal" : "deals"}`}
                  {stageValue > 0 && (
                    <>
                      {", "}
                      <span className="text-foreground">
                        {formatAmount(stageValue, currency)}
                      </span>
                    </>
                  )}
                </p>

                <ul className="mt-3 flex flex-col gap-3">
                  {stageDeals.map((deal) => {
                    const isLate =
                      !won &&
                      deal.expected_closing_date != null &&
                      new Date(deal.expected_closing_date) < today;
                    return (
                      <li key={deal.id}>
                        <Link
                          to={`/deals/${deal.id}/show`}
                          className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <span className="block font-condensed font-semibold leading-snug group-hover:text-primary">
                            {companyName(deal) ?? deal.name}
                          </span>
                          <span className="block text-sm text-muted-foreground leading-snug">
                            {deal.name}
                          </span>
                          {deal.expected_closing_date && (
                            <span
                              className={
                                "block text-xs mt-0.5 tabular-nums " +
                                (isLate
                                  ? "text-signal font-medium"
                                  : "text-muted-foreground")
                              }
                            >
                              {isLate ? "Was due " : "Close by "}
                              {formatDate(deal.expected_closing_date)}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      {offLineStages.some((stage) =>
        deals.some((deal) => deal.stage === stage.value),
      ) && (
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-2 text-sm">
          {offLineStages.map((stage) => {
            const stageDeals = deals.filter(
              (deal) => deal.stage === stage.value,
            );
            if (stageDeals.length === 0) return null;
            return (
              <div key={stage.value} className="flex gap-2">
                <dt className="text-muted-foreground">{stage.label}:</dt>
                <dd className="flex flex-wrap gap-x-3">
                  {stageDeals.map((deal) => (
                    <Link
                      key={deal.id}
                      to={`/deals/${deal.id}/show`}
                      className="underline-offset-4 hover:underline"
                    >
                      {companyName(deal) ?? deal.name}
                    </Link>
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
};
