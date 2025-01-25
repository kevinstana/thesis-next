"use server";

import { authFetch } from "@/lib/server-actions";

export async function getHuaUsers(urlSearchParams: string) {
  const res = await authFetch(`hua-users?${urlSearchParams}`, "GET");

  return res;
}
