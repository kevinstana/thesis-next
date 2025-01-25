"use server"

import { authFetch } from "@/lib/server-actions";

export async function getAllUsers(urlSearchParams: string) {
  const res = await authFetch(`users?${urlSearchParams}`, "GET");

  return res;
}
