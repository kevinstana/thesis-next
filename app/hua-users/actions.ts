"use server";

import { authFetch } from "@/lib/utils";

export async function getHuaUsers(urlSearchParams: string) {
  const res = await authFetch(`hua-users?${urlSearchParams}`, "GET");

  return res;
}
