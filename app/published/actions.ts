"use server";

import { authFetch } from "@/lib/server-actions";

export async function getPublished(searchParams: string) {
  const res = await authFetch(
    `theses/published?${searchParams}`,
    "GET",
    null,
    null,
    "published-theses"
  );

  return res;
}
