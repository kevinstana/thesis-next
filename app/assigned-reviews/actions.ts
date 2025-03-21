import { authFetch } from "@/lib/server-actions";

export async function getAssignedReviews(urlSearchParams: string) {
  const res = await authFetch(
    `theses/assigned-reviews?${urlSearchParams}`,
    "GET",
    null,
    null,
    "assigned-reviews"
  );

  return res;
}