import { useState } from "react";
import { useGetList } from "ra-core";
import { Link } from "react-router";

import type { Contact, Tag } from "../types";

// Tags come in three families named "<Family>: <value>". Outreach progress
// comes from the contact's Status (values from kontrolNoteStatuses).
const FAMILIES = ["Type", "Area", "Source"] as const;
type Family = (typeof FAMILIES)[number];
const NOT_YET_CONTACTED = ["not-contacted"];
const TALKING = ["in-conversation", "review-booked", "proposal-sent"];

type CampaignRow = {
  tag: Tag;
  total: number;
  contacted: number;
  talking: number;
};

const contactsWithTagLink = (tagId: Tag["id"]) =>
  `/contacts?filter=${encodeURIComponent(
    JSON.stringify({ "tags@cs": `{${tagId}}` }),
  )}`;

/**
 * One row per tag in the chosen family (Type, Area or Source): how much of the
 * group has been worked, and how many contacts are now in a real conversation.
 */
export const CampaignProgress = () => {
  const [family, setFamily] = useState<Family>("Type");
  const { data: tags = [], isPending: isPendingTags } = useGetList<Tag>(
    "tags",
    { pagination: { page: 1, perPage: 500 } },
  );
  const { data: contacts = [], isPending: isPendingContacts } =
    useGetList<Contact>("contacts", {
      pagination: { page: 1, perPage: 5000 },
    });

  if (isPendingTags || isPendingContacts) return null;

  const prefix = `${family}: `;
  const rows: CampaignRow[] = tags
    .filter((tag) => tag.name.startsWith(prefix))
    .map((tag) => {
      const members = contacts.filter((contact) =>
        contact.tags?.includes(tag.id),
      );
      return {
        tag,
        total: members.length,
        contacted: members.filter(
          (contact) =>
            contact.status != null &&
            !NOT_YET_CONTACTED.includes(contact.status),
        ).length,
        talking: members.filter(
          (contact) =>
            contact.status != null && TALKING.includes(contact.status),
        ).length,
      };
    })
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <section aria-labelledby="campaigns-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="campaigns-heading"
          className="font-condensed text-xl font-semibold tracking-tight"
        >
          Outreach progress
        </h2>
        <div
          role="group"
          aria-label="Group outreach progress by"
          className="flex rounded-md border p-0.5 text-sm"
        >
          {FAMILIES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={family === option}
              onClick={() => setFamily(option)}
              className={
                "rounded-sm px-2.5 py-1 focus-visible:outline-2 focus-visible:outline-ring " +
                (family === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Bar shows how much of each group you have contacted. Darker teal is
        contacts you are talking to.
      </p>
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No contacts have a {family.toLowerCase()} tag yet.
        </p>
      )}
      <ul className="flex flex-col divide-y">
        {rows.map(({ tag, total, contacted, talking }) => (
          <li key={tag.id} className="py-2.5">
            <Link
              to={contactsWithTagLink(tag.id)}
              className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium leading-snug group-hover:text-primary">
                  {tag.name.slice(prefix.length)}
                </span>
                <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                  {contacted} of {total}
                  {talking > 0 && (
                    <span className="text-foreground">, {talking} talking</span>
                  )}
                </span>
              </div>
              <div
                className="relative mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden"
                role="img"
                aria-label={`${contacted} of ${total} contacted, ${talking} talking`}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-primary/35"
                  style={{ width: `${(contacted / total) * 100}%` }}
                />
                <span
                  className="absolute inset-y-0 left-0 bg-primary"
                  style={{ width: `${(talking / total) * 100}%` }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
