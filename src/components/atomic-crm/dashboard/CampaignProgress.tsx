import { useGetList } from "ra-core";
import { Link } from "react-router";

import type { Contact, Tag } from "../types";

// Every tag is a campaign; outreach progress comes from the contact's Status
// (values from kontrolNoteStatuses).
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
 * One row per campaign tag: how much of the list has been worked, and how many
 * contacts are now in a real conversation.
 */
export const CampaignProgress = () => {
  const { data: tags = [], isPending: isPendingTags } = useGetList<Tag>(
    "tags",
    { pagination: { page: 1, perPage: 500 } },
  );
  const { data: contacts = [], isPending: isPendingContacts } =
    useGetList<Contact>("contacts", {
      pagination: { page: 1, perPage: 5000 },
    });

  if (isPendingTags || isPendingContacts) return null;

  const rows: CampaignRow[] = tags
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

  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="campaigns-heading">
      <h2
        id="campaigns-heading"
        className="font-condensed text-xl font-semibold tracking-tight"
      >
        Outreach by campaign
      </h2>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Bar shows how much of each list you have contacted. Darker teal is
        contacts you are talking to.
      </p>
      <ul className="flex flex-col divide-y">
        {rows.map(({ tag, total, contacted, talking }) => (
          <li key={tag.id} className="py-2.5">
            <Link
              to={contactsWithTagLink(tag.id)}
              className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium leading-snug group-hover:text-primary">
                  {tag.name}
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
