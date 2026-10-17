import type { DataProvider } from "ra-core";
import { describe, expect, it, vi } from "vitest";

import { createTagResolver } from "./useImportFromJson";

const makeDataProvider = (initialTags: Array<{ id: number; name: string }>) => {
  const tags = [...initialTags];
  const getList = vi.fn(async (_resource: string, params: any) => {
    // Yield so concurrent callers interleave like real network calls
    await new Promise((resolve) => setTimeout(resolve, 5));
    const data = tags.filter((tag) => tag.name === params.filter.name);
    return { data, total: data.length };
  });
  const create = vi.fn(async (_resource: string, params: any) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    const tag = { id: tags.length + 100, ...params.data };
    tags.push(tag);
    return { data: tag };
  });
  return {
    dataProvider: { getList, create } as unknown as DataProvider,
    getList,
    create,
    tags,
  };
};

describe("createTagResolver", () => {
  it("creates a tag shared by concurrent contacts only once", async () => {
    const { dataProvider, create, tags } = makeDataProvider([]);
    const resolveTag = createTagResolver(dataProvider);

    // Several contacts importing in parallel, all tagged "prospect"
    const contacts = Array.from({ length: 10 }, () => ["prospect"]);
    const ids = await Promise.all(
      contacts.map((contactTags) => Promise.all(contactTags.map(resolveTag))),
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(tags.filter((tag) => tag.name === "prospect")).toHaveLength(1);
    expect(new Set(ids.flat()).size).toBe(1);
  });

  it("reuses an existing tag with the same name", async () => {
    const { dataProvider, create } = makeDataProvider([
      { id: 7, name: "prospect" },
    ]);
    const resolveTag = createTagResolver(dataProvider);

    const ids = await Promise.all([
      resolveTag("prospect"),
      resolveTag(" prospect "),
    ]);

    expect(create).not.toHaveBeenCalled();
    expect(ids).toEqual([7, 7]);
  });

  it("retries a tag whose creation failed", async () => {
    const { dataProvider, create } = makeDataProvider([]);
    create.mockRejectedValueOnce(new Error("network"));
    const resolveTag = createTagResolver(dataProvider);

    await expect(resolveTag("prospect")).rejects.toThrow("network");
    await expect(resolveTag("prospect")).resolves.toBeDefined();
    expect(create).toHaveBeenCalledTimes(2);
  });
});
