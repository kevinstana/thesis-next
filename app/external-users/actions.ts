"use server";

import { authFetch } from "@/lib/utils";
import { CreateExternalUser } from "@/types/app-types";
import { revalidateTag } from "next/cache";

export async function getExternalUsers(urlSearchParams: string) {
  const res = await authFetch(
    `external-users?${urlSearchParams}`,
    "GET",
    null,
    "external-users"
  );

  return res;
}

export async function createExternalUser(user: CreateExternalUser | undefined) {
  const res = await authFetch("external-users", "POST", user);
  revalidateTag("external-users");

  return res;
}

export async function getExternalUserProfile(username: string) {
  const res = await authFetch(`external-users/${username}`, "GET");

  return res;
}
