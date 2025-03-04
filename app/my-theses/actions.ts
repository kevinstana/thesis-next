import { authFetch } from "@/lib/server-actions";

export async function getTheses(urlSearchParams: string) {
  const res = await authFetch(
    `theses/me?${urlSearchParams}`,
    "GET",
    null,
    "my-theses"
  );

  return res;
}